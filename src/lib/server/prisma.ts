import "server-only";

import mongoose, { Schema, Model } from "mongoose";
import { dbConnect } from "@/lib/db";

type Doc = Record<string, unknown>;

function modelFromSchema<T extends Doc>(name: string, schemaFields: Record<string, unknown>, collection?: string): Model<T> {
  if (mongoose.models[name]) return mongoose.models[name] as Model<T>;
  const schema = new Schema<T>(
    { _id: String, ...schemaFields } as any,
    { strict: false, timestamps: true, collection, _id: false }
  );
  return mongoose.model<T>(name, schema, collection);
}

function ensureId(data: Doc): Doc {
  if (!data._id && !data.id) {
    return { ...data, _id: crypto.randomUUID() };
  }
  return data;
}

function makeModel(name: string, collection?: string): Model<Doc> {
  return modelFromSchema<Doc>(name, {}, collection);
}

const models: Record<string, Model<Doc>> = {};

async function getModel(name: string): Promise<Model<Doc>> {
  if (!models[name]) {
    await dbConnect();
    models[name] = makeModel(name);
  }
  return models[name];
}

function convertWhere(where: Record<string, unknown> = {}): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(where)) {
    if (key === "id") {
      result._id = value;
    } else if (key === "NOT" || key === "not") {
      Object.assign(result, { $nor: [convertWhere(value as Record<string, unknown>)] });
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const inner = value as Record<string, unknown>;
      const mongo: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(inner)) {
        if (k === "not") mongo.$ne = v;
        else if (k === "in") mongo.$in = v;
        else if (k === "gt") mongo.$gt = v;
        else if (k === "gte") mongo.$gte = v;
        else if (k === "lt") mongo.$lt = v;
        else if (k === "lte") mongo.$lte = v;
        else if (k === "contains") { mongo.$regex = v; mongo.$options = "i"; }
        else if (k === "startsWith") { mongo.$regex = `^${v}`; mongo.$options = "i"; }
        else mongo[k] = v;
      }
      result[key] = mongo;
    } else {
      result[key] = value;
    }
  }
  return result;
}

function convertOrderBy(orderBy?: Record<string, string> | Record<string, string>[]): Record<string, 1 | -1> {
  if (!orderBy) return {};
  const arr = Array.isArray(orderBy) ? orderBy : [orderBy];
  const sort: Record<string, 1 | -1> = {};
  for (const item of arr) {
    for (const [key, dir] of Object.entries(item)) {
      sort[key === "id" ? "_id" : key] = dir === "desc" ? -1 : 1;
    }
  }
  return sort;
}

function convertSelect(select?: Record<string, boolean>): Record<string, 1 | 0> {
  if (!select) return {};
  const projection: Record<string, 1 | 0> = {};
  for (const [key, include] of Object.entries(select)) {
    projection[key === "id" ? "_id" : key] = include ? 1 : 0;
  }
  if (select.id && !projection._id) projection._id = 1;
  return projection;
}

function removeId(result: Doc): Doc {
  const { _id, __v, ...rest } = result;
  return { ...rest, id: String(_id) };
}

function removeIds(results: Doc[]): Doc[] {
  return results.map(removeId);
}

async function handleInclude(model: Model<Doc>, doc: Doc, include?: Record<string, boolean | { select: Record<string, boolean> }>): Promise<Doc> {
  if (!include || !doc) return doc;
  for (const [key, value] of Object.entries(include)) {
    if (value) {
      const refModel = await getModel(key);
      const refId = doc[`${key}Id`] || doc[key];
      if (refId && typeof refId === "string") {
        const ref = await refModel.findById(refId).lean();
        if (ref) doc[key] = removeId(ref);
      }
    }
  }
  return doc;
}

async function handleIncludes(model: Model<Doc>, docs: Doc[], include?: Record<string, boolean | { select: Record<string, boolean> }>): Promise<Doc[]> {
  if (!include) return docs;
  return Promise.all(docs.map((doc) => handleInclude(model, doc, include)));
}

const prisma = {
  admin: {
    async findUnique({ where, include }: { where: { id?: string; email?: string }; include?: Record<string, boolean | { select: Record<string, boolean> }> }): Promise<Doc | null> {
      const m = await getModel("Admin");
      const query = where.id ? { _id: convertWhere({ id: where.id })._id } : convertWhere(where);
      const doc = await m.findOne(query).lean();
      if (!doc) return null;
      return handleInclude(m, removeId(doc), include);
    },
    async update({ where, data, include }: { where: { id: string }; data: Doc; include?: Record<string, boolean | { select: Record<string, boolean> }> }): Promise<Doc> {
      const m = await getModel("Admin");
      const doc = await m.findByIdAndUpdate(where.id, { $set: data }, { new: true }).lean();
      if (!doc) throw new Error("Admin not found");
      return handleInclude(m, removeId(doc), include);
    },
    async upsert({ where, update, create, include }: { where: { id?: string; email?: string }; update: Doc; create: Doc; include?: Record<string, boolean | { select: Record<string, boolean> }> }): Promise<Doc> {
      const m = await getModel("Admin");
      const filter = where.email ? { email: where.email } : { _id: where.id };
      const doc = await m.findOneAndUpdate(filter, { $set: update, $setOnInsert: create }, { upsert: true, new: true }).lean();
      return handleInclude(m, removeId(doc!), include);
    }
  },
  role: {
    async upsert({ where, update, create }: { where: { name: string }; update: Doc; create: Doc }): Promise<Doc> {
      const m = await getModel("Role");
      const doc = await m.findOneAndUpdate({ name: where.name }, { $set: update, $setOnInsert: create }, { upsert: true, new: true }).lean();
      return removeId(doc!);
    }
  },
  contactInquiry: {
    async count({ where }: { where?: Doc } = {}): Promise<number> {
      const m = await getModel("ContactInquiry");
      return m.countDocuments(where ? convertWhere(where) : {});
    },
    async findMany({ where, orderBy, take, select }: { where?: Doc; orderBy?: Record<string, string> | Record<string, string>[]; take?: number; select?: Record<string, boolean> } = {}): Promise<Doc[]> {
      const m = await getModel("ContactInquiry");
      let query = m.find(where ? convertWhere(where) : {});
      const sort = convertOrderBy(orderBy);
      if (Object.keys(sort).length) query = query.sort(sort);
      if (take) query = query.limit(take);
      if (select) query = query.select(convertSelect(select));
      const docs = await query.lean();
      return removeIds(docs as Doc[]);
    },
    async groupBy({ by, where, _count }: { by: string[]; where?: Doc; _count: { _all: true } }): Promise<Array<{ [key: string]: unknown; _count: { _all: number } }>> {
      const m = await getModel("ContactInquiry");
      const match: Doc = where ? convertWhere(where) : {};
      const groupId: Doc = {};
      for (const field of by) groupId[field] = `$${field}`;
      const docs = await m.aggregate([
        { $match: match },
        { $group: { _id: groupId, _count: { $sum: 1 } } },
        { $project: { _id: 0, ...Object.fromEntries(by.map((f) => [f, `$_id.${f}`])), _count: { _all: "$_count" } } }
      ]);
      return docs;
    },
    async update({ where, data }: { where: { id: string }; data: Doc }): Promise<Doc> {
      const m = await getModel("ContactInquiry");
      const doc = await m.findByIdAndUpdate(where.id, { $set: data }, { new: true }).lean();
      if (!doc) throw new Error("ContactInquiry not found");
      return removeId(doc);
    },
    async delete({ where }: { where: { id: string } }): Promise<Doc> {
      const m = await getModel("ContactInquiry");
      const doc = await m.findByIdAndDelete(where.id).lean();
      if (!doc) throw new Error("ContactInquiry not found");
      return removeId(doc);
    }
  },
  consultation: {
    async count({ where }: { where?: Doc } = {}): Promise<number> {
      const m = await getModel("Consultation");
      return m.countDocuments(where ? convertWhere(where) : {});
    },
    async findMany({ where, orderBy, take, select }: { where?: Doc; orderBy?: Record<string, string> | Record<string, string>[]; take?: number; select?: Record<string, boolean> } = {}): Promise<Doc[]> {
      const m = await getModel("Consultation");
      let query = m.find(where ? convertWhere(where) : {});
      const sort = convertOrderBy(orderBy);
      if (Object.keys(sort).length) query = query.sort(sort);
      if (take) query = query.limit(take);
      if (select) query = query.select(convertSelect(select));
      const docs = await query.lean();
      return removeIds(docs as Doc[]);
    },
    async groupBy({ by, where, _count }: { by: string[]; where?: Doc; _count: { _all: true } }): Promise<Array<{ [key: string]: unknown; _count: { _all: number } }>> {
      const m = await getModel("Consultation");
      const match: Doc = where ? convertWhere(where) : {};
      const groupId: Doc = {};
      for (const field of by) groupId[field] = `$${field}`;
      const docs = await m.aggregate([
        { $match: match },
        { $group: { _id: groupId, _count: { $sum: 1 } } },
        { $project: { _id: 0, ...Object.fromEntries(by.map((f) => [f, `$_id.${f}`])), _count: { _all: "$_count" } } }
      ]);
      return docs;
    },
    async update({ where, data }: { where: { id: string }; data: Doc }): Promise<Doc> {
      const m = await getModel("Consultation");
      const doc = await m.findByIdAndUpdate(where.id, { $set: data }, { new: true }).lean();
      if (!doc) throw new Error("Consultation not found");
      return removeId(doc);
    }
  },
  careerApplication: {
    async count({ where }: { where?: Doc } = {}): Promise<number> {
      const m = await getModel("CareerApplication");
      return m.countDocuments(where ? convertWhere(where) : {});
    },
    async findMany({ where, orderBy, take, select }: { where?: Doc; orderBy?: Record<string, string> | Record<string, string>[]; take?: number; select?: Record<string, boolean> } = {}): Promise<Doc[]> {
      const m = await getModel("CareerApplication");
      let query = m.find(where ? convertWhere(where) : {});
      const sort = convertOrderBy(orderBy);
      if (Object.keys(sort).length) query = query.sort(sort);
      if (take) query = query.limit(take);
      if (select) query = query.select(convertSelect(select));
      const docs = await query.lean();
      return removeIds(docs as Doc[]);
    },
    async groupBy({ by, where, _count }: { by: string[]; where?: Doc; _count: { _all: true } }): Promise<Array<{ [key: string]: unknown; _count: { _all: number } }>> {
      const m = await getModel("CareerApplication");
      const match: Doc = where ? convertWhere(where) : {};
      const groupId: Doc = {};
      for (const field of by) groupId[field] = `$${field}`;
      const docs = await m.aggregate([
        { $match: match },
        { $group: { _id: groupId, _count: { $sum: 1 } } },
        { $project: { _id: 0, ...Object.fromEntries(by.map((f) => [f, `$_id.${f}`])), _count: { _all: "$_count" } } }
      ]);
      return docs;
    },
    async update({ where, data }: { where: { id: string }; data: Doc }): Promise<Doc> {
      const m = await getModel("CareerApplication");
      const doc = await m.findByIdAndUpdate(where.id, { $set: data }, { new: true }).lean();
      if (!doc) throw new Error("CareerApplication not found");
      return removeId(doc);
    },
    async delete({ where }: { where: { id: string } }): Promise<Doc> {
      const m = await getModel("CareerApplication");
      const doc = await m.findByIdAndDelete(where.id).lean();
      if (!doc) throw new Error("CareerApplication not found");
      return removeId(doc);
    }
  },
  blog: {
    async count({ where }: { where?: Doc } = {}): Promise<number> {
      const m = await getModel("Blog");
      return m.countDocuments(where ? convertWhere(where) : {});
    },
    async findMany({ where, orderBy, take, select }: { where?: Doc; orderBy?: Record<string, string> | Record<string, string>[]; take?: number; select?: Record<string, boolean> } = {}): Promise<Doc[]> {
      const m = await getModel("Blog");
      let query = m.find(where ? convertWhere(where) : {});
      const sort = convertOrderBy(orderBy);
      if (Object.keys(sort).length) query = query.sort(sort);
      if (take) query = query.limit(take);
      if (select) query = query.select(convertSelect(select));
      const docs = await query.lean();
      return removeIds(docs as Doc[]);
    },
    async create({ data }: { data: Doc }): Promise<Doc> {
      const m = await getModel("Blog");
      const doc = await m.create(ensureId(data));
      return removeId(doc.toObject());
    },
    async update({ where, data }: { where: { id: string }; data: Doc }): Promise<Doc> {
      const m = await getModel("Blog");
      const doc = await m.findByIdAndUpdate(where.id, { $set: data }, { new: true }).lean();
      if (!doc) throw new Error("Blog not found");
      return removeId(doc);
    },
    async delete({ where }: { where: { id: string } }): Promise<Doc> {
      const m = await getModel("Blog");
      const doc = await m.findByIdAndDelete(where.id).lean();
      if (!doc) throw new Error("Blog not found");
      return removeId(doc);
    }
  },
  newsletter: {
    async findMany({ where, orderBy, take, select }: { where?: Doc; orderBy?: Record<string, string> | Record<string, string>[]; take?: number; select?: Record<string, boolean> } = {}): Promise<Doc[]> {
      const m = await getModel("Newsletter");
      let query = m.find(where ? convertWhere(where) : {});
      const sort = convertOrderBy(orderBy);
      if (Object.keys(sort).length) query = query.sort(sort);
      if (take) query = query.limit(take);
      if (select) query = query.select(convertSelect(select));
      const docs = await query.lean();
      return removeIds(docs as Doc[]);
    },
    async create({ data }: { data: Doc }): Promise<Doc> {
      const m = await getModel("Newsletter");
      const doc = await m.create(ensureId(data));
      return removeId(doc.toObject());
    },
    async update({ where, data }: { where: { id: string }; data: Doc }): Promise<Doc> {
      const m = await getModel("Newsletter");
      const doc = await m.findByIdAndUpdate(where.id, { $set: data }, { new: true }).lean();
      if (!doc) throw new Error("Newsletter not found");
      return removeId(doc);
    }
  },
  newsletterSubscriber: {
    async findMany({ where, orderBy, take, select }: { where?: Doc; orderBy?: Record<string, string> | Record<string, string>[]; take?: number; select?: Record<string, boolean> } = {}): Promise<Doc[]> {
      const m = await getModel("NewsletterSubscriber");
      let query = m.find(where ? convertWhere(where) : {});
      const sort = convertOrderBy(orderBy);
      if (Object.keys(sort).length) query = query.sort(sort);
      if (take) query = query.limit(take);
      if (select) query = query.select(convertSelect(select));
      const docs = await query.lean();
      return removeIds(docs as Doc[]);
    },
    async delete({ where }: { where: { id: string } }): Promise<Doc> {
      const m = await getModel("NewsletterSubscriber");
      const doc = await m.findByIdAndDelete(where.id).lean();
      if (!doc) throw new Error("NewsletterSubscriber not found");
      return removeId(doc);
    }
  },
  subscriber: {
    async findMany({ where, orderBy, take, select }: { where?: Doc; orderBy?: Record<string, string> | Record<string, string>[]; take?: number; select?: Record<string, boolean> } = {}): Promise<Doc[]> {
      const m = await getModel("Subscriber");
      let query = m.find(where ? convertWhere(where) : {});
      const sort = convertOrderBy(orderBy);
      if (Object.keys(sort).length) query = query.sort(sort);
      if (take) query = query.limit(take);
      if (select) query = query.select(convertSelect(select));
      const docs = await query.lean();
      return removeIds(docs as Doc[]);
    },
    async delete({ where }: { where: { id: string } }): Promise<Doc> {
      const m = await getModel("Subscriber");
      const doc = await m.findByIdAndDelete(where.id).lean();
      if (!doc) throw new Error("Subscriber not found");
      return removeId(doc);
    }
  },
  serviceOffer: {
    async count({ where }: { where?: Doc } = {}): Promise<number> {
      const m = await getModel("ServiceOffer");
      return m.countDocuments(where ? convertWhere(where) : {});
    },
    async findMany({ where, orderBy, take, include }: { where?: Doc; orderBy?: Record<string, string> | Record<string, string>[]; take?: number; include?: Record<string, boolean | { select: Record<string, boolean> }> } = {}): Promise<Doc[]> {
      const m = await getModel("ServiceOffer");
      let query = m.find(where ? convertWhere(where) : {});
      const sort = convertOrderBy(orderBy);
      if (Object.keys(sort).length) query = query.sort(sort);
      if (take) query = query.limit(take);
      let docs = await query.lean() as Doc[];
      docs = removeIds(docs);
      docs = await handleIncludes(m, docs, include);
      return docs;
    },
    async create({ data }: { data: Doc }): Promise<Doc> {
      const m = await getModel("ServiceOffer");
      const doc = await m.create(ensureId(data));
      return removeId(doc.toObject());
    },
    async update({ where, data }: { where: { id: string }; data: Doc }): Promise<Doc> {
      const m = await getModel("ServiceOffer");
      const doc = await m.findByIdAndUpdate(where.id, { $set: data }, { new: true }).lean();
      if (!doc) throw new Error("ServiceOffer not found");
      return removeId(doc);
    },
    async delete({ where }: { where: { id: string } }): Promise<Doc> {
      const m = await getModel("ServiceOffer");
      const doc = await m.findByIdAndDelete(where.id).lean();
      if (!doc) throw new Error("ServiceOffer not found");
      return removeId(doc);
    }
  },
  mediaAsset: {
    async findMany({ where, orderBy, take, select }: { where?: Doc; orderBy?: Record<string, string> | Record<string, string>[]; take?: number; select?: Record<string, boolean> } = {}): Promise<Doc[]> {
      const m = await getModel("MediaAsset");
      let query = m.find(where ? convertWhere(where) : {});
      const sort = convertOrderBy(orderBy);
      if (Object.keys(sort).length) query = query.sort(sort);
      if (take) query = query.limit(take);
      if (select) query = query.select(convertSelect(select));
      const docs = await query.lean();
      return removeIds(docs as Doc[]);
    },
    async findUnique({ where }: { where: { id: string } }): Promise<Doc | null> {
      const m = await getModel("MediaAsset");
      const doc = await m.findById(where.id).lean();
      return doc ? removeId(doc) : null;
    },
    async create({ data }: { data: Doc }): Promise<Doc> {
      const m = await getModel("MediaAsset");
      const doc = await m.create(ensureId(data));
      return removeId(doc.toObject());
    },
    async delete({ where }: { where: { id: string } }): Promise<Doc> {
      const m = await getModel("MediaAsset");
      const doc = await m.findByIdAndDelete(where.id).lean();
      if (!doc) throw new Error("MediaAsset not found");
      return removeId(doc);
    }
  },
  careerJob: {
    async findMany({ where, orderBy, take, select }: { where?: Doc; orderBy?: Record<string, string> | Record<string, string>[]; take?: number; select?: Record<string, boolean> } = {}): Promise<Doc[]> {
      const m = await getModel("CareerJob");
      let query = m.find(where ? convertWhere(where) : {});
      const sort = convertOrderBy(orderBy);
      if (Object.keys(sort).length) query = query.sort(sort);
      if (take) query = query.limit(take);
      if (select) query = query.select(convertSelect(select));
      const docs = await query.lean();
      return removeIds(docs as Doc[]);
    },
    async create({ data }: { data: Doc }): Promise<Doc> {
      const m = await getModel("CareerJob");
      const doc = await m.create(ensureId(data));
      return removeId(doc.toObject());
    },
    async update({ where, data }: { where: { id: string }; data: Doc }): Promise<Doc> {
      const m = await getModel("CareerJob");
      const doc = await m.findByIdAndUpdate(where.id, { $set: data }, { new: true }).lean();
      if (!doc) throw new Error("CareerJob not found");
      return removeId(doc);
    },
    async delete({ where }: { where: { id: string } }): Promise<Doc> {
      const m = await getModel("CareerJob");
      const doc = await m.findByIdAndDelete(where.id).lean();
      if (!doc) throw new Error("CareerJob not found");
      return removeId(doc);
    }
  },
  settings: {
    async findMany({ where, orderBy }: { where?: Doc; orderBy?: Record<string, string> | Record<string, string>[] } = {}): Promise<Doc[]> {
      const m = await getModel("Settings");
      let query = m.find(where ? convertWhere(where) : {});
      const sort = convertOrderBy(orderBy);
      if (Object.keys(sort).length) query = query.sort(sort);
      const docs = await query.lean();
      return removeIds(docs as Doc[]);
    },
    async upsert({ where, update, create }: { where: { key: string }; update: Doc; create: Doc }): Promise<Doc> {
      const m = await getModel("Settings");
      const doc = await m.findOneAndUpdate(
        { key: where.key },
        { $set: update, $setOnInsert: create },
        { upsert: true, new: true }
      ).lean();
      return removeId(doc!);
    }
  },
  auditLog: {
    async findMany({ where, orderBy, take, include }: { where?: Doc; orderBy?: Record<string, string> | Record<string, string>[]; take?: number; include?: Record<string, boolean | { select: Record<string, boolean> }> } = {}): Promise<Doc[]> {
      const m = await getModel("AuditLog");
      let query = m.find(where ? convertWhere(where) : {});
      const sort = convertOrderBy(orderBy);
      if (Object.keys(sort).length) query = query.sort(sort);
      if (take) query = query.limit(take);
      let docs = await query.lean() as Doc[];
      docs = removeIds(docs);
      docs = await handleIncludes(m, docs, include);
      return docs;
    },
    async create({ data }: { data: Doc }): Promise<Doc> {
      const m = await getModel("AuditLog");
      const doc = await m.create(ensureId(data));
      return removeId(doc.toObject());
    }
  },
  companyDivision: {
    async findMany({ where, orderBy, select }: { where?: Doc; orderBy?: Record<string, string> | Record<string, string>[]; select?: Record<string, boolean> } = {}): Promise<Doc[]> {
      const m = await getModel("CompanyDivision");
      let query = m.find(where ? convertWhere(where) : {});
      const sort = convertOrderBy(orderBy);
      if (Object.keys(sort).length) query = query.sort(sort);
      if (select) query = query.select(convertSelect(select));
      const docs = await query.lean();
      return removeIds(docs as Doc[]);
    },
    async findUnique({ where, select }: { where: { id?: string; slug?: string }; select?: Record<string, boolean> }): Promise<Doc | null> {
      const m = await getModel("CompanyDivision");
      const query = where.slug ? { slug: where.slug } : { _id: where.id };
      let q = m.findOne(query);
      if (select) q = q.select(convertSelect(select));
      const doc = await q.lean();
      return doc ? removeId(doc) : null;
    },
    async create({ data }: { data: Doc }): Promise<Doc> {
      const m = await getModel("CompanyDivision");
      const doc = await m.create(ensureId(data));
      return removeId(doc.toObject());
    },
    async update({ where, data }: { where: { id: string }; data: Doc }): Promise<Doc> {
      const m = await getModel("CompanyDivision");
      const doc = await m.findByIdAndUpdate(where.id, { $set: data }, { new: true }).lean();
      if (!doc) throw new Error("CompanyDivision not found");
      return removeId(doc);
    },
    async upsert({ where, update, create }: { where: { id?: string; slug?: string }; update: Doc; create: Doc }): Promise<Doc> {
      const m = await getModel("CompanyDivision");
      const filter = where.slug ? { slug: where.slug } : { _id: where.id };
      const doc = await m.findOneAndUpdate(filter, { $set: update, $setOnInsert: create }, { upsert: true, new: true }).lean();
      return removeId(doc!);
    }
  },
  project: {
    async findMany({ where, orderBy, take, include }: { where?: Doc; orderBy?: Record<string, string> | Record<string, string>[]; take?: number; include?: Record<string, boolean | { select: Record<string, boolean> }> } = {}): Promise<Doc[]> {
      const m = await getModel("Project");
      let query = m.find(where ? convertWhere(where) : {});
      const sort = convertOrderBy(orderBy);
      if (Object.keys(sort).length) query = query.sort(sort);
      if (take) query = query.limit(take);
      let docs = await query.lean() as Doc[];
      docs = removeIds(docs);
      docs = await handleIncludes(m, docs, include);
      return docs;
    }
  },
  ingestedProject: {
    async findMany({ where, orderBy, take }: { where?: Doc; orderBy?: Record<string, string> | Record<string, string>[]; take?: number } = {}): Promise<Doc[]> {
      const m = await getModel("IngestedProject");
      let query = m.find(where ? convertWhere(where) : {});
      const sort = convertOrderBy(orderBy);
      if (Object.keys(sort).length) query = query.sort(sort);
      if (take) query = query.limit(take);
      const docs = await query.lean();
      return removeIds(docs as Doc[]);
    }
  },
  ingestedDocument: {
    async findMany({ where, orderBy, take }: { where?: Doc; orderBy?: Record<string, string> | Record<string, string>[]; take?: number } = {}): Promise<Doc[]> {
      const m = await getModel("IngestedDocument");
      let query = m.find(where ? convertWhere(where) : {});
      const sort = convertOrderBy(orderBy);
      if (Object.keys(sort).length) query = query.sort(sort);
      if (take) query = query.limit(take);
      const docs = await query.lean();
      return removeIds(docs as Doc[]);
    }
  },
  ingestionEvent: {
    async findMany({ where, orderBy, take }: { where?: Doc; orderBy?: Record<string, string> | Record<string, string>[]; take?: number } = {}): Promise<Doc[]> {
      const m = await getModel("IngestionEvent");
      let query = m.find(where ? convertWhere(where) : {});
      const sort = convertOrderBy(orderBy);
      if (Object.keys(sort).length) query = query.sort(sort);
      if (take) query = query.limit(take);
      const docs = await query.lean();
      return removeIds(docs as Doc[]);
    }
  },
  domainMapping: {
    async findMany({ where, orderBy }: { where?: Doc; orderBy?: Record<string, string> | Record<string, string>[] } = {}): Promise<Doc[]> {
      const m = await getModel("DomainMapping");
      let query = m.find(where ? convertWhere(where) : {});
      const sort = convertOrderBy(orderBy);
      if (Object.keys(sort).length) query = query.sort(sort);
      const docs = await query.lean();
      return removeIds(docs as Doc[]);
    },
    async create({ data }: { data: Doc }): Promise<Doc> {
      const m = await getModel("DomainMapping");
      const doc = await m.create(ensureId(data));
      return removeId(doc.toObject());
    },
    async update({ where, data }: { where: { id: string }; data: Doc }): Promise<Doc> {
      const m = await getModel("DomainMapping");
      const doc = await m.findByIdAndUpdate(where.id, { $set: data }, { new: true }).lean();
      if (!doc) throw new Error("DomainMapping not found");
      return removeId(doc);
    },
    async updateMany({ where, data }: { where: Doc; data: Doc }): Promise<{ count: number }> {
      const m = await getModel("DomainMapping");
      const result = await m.updateMany(convertWhere(where), { $set: data });
      return { count: result.modifiedCount };
    },
    async delete({ where }: { where: { id: string } }): Promise<Doc> {
      const m = await getModel("DomainMapping");
      const doc = await m.findByIdAndDelete(where.id).lean();
      if (!doc) throw new Error("DomainMapping not found");
      return removeId(doc);
    }
  },
  blogComment: {
    async findMany({ where, orderBy, take, include }: { where?: Doc; orderBy?: Record<string, string> | Record<string, string>[]; take?: number; include?: Record<string, boolean | { select: Record<string, boolean> }> } = {}): Promise<Doc[]> {
      const m = await getModel("BlogComment");
      let query = m.find(where ? convertWhere(where) : {});
      const sort = convertOrderBy(orderBy);
      if (Object.keys(sort).length) query = query.sort(sort);
      if (take) query = query.limit(take);
      let docs = await query.lean() as Doc[];
      docs = removeIds(docs);
      docs = await handleIncludes(m, docs, include);
      return docs;
    }
  },
  chatbotQuery: {
    async findMany({ where, orderBy, take }: { where?: Doc; orderBy?: Record<string, string> | Record<string, string>[]; take?: number } = {}): Promise<Doc[]> {
      const m = await getModel("ChatbotQuery");
      let query = m.find(where ? convertWhere(where) : {});
      const sort = convertOrderBy(orderBy);
      if (Object.keys(sort).length) query = query.sort(sort);
      if (take) query = query.limit(take);
      const docs = await query.lean();
      return removeIds(docs as Doc[]);
    }
  },
  notification: {
    async findMany({ where, orderBy, take }: { where?: Doc; orderBy?: Record<string, string> | Record<string, string>[]; take?: number } = {}): Promise<Doc[]> {
      const m = await getModel("Notification");
      let query = m.find(where ? convertWhere(where) : {});
      const sort = convertOrderBy(orderBy);
      if (Object.keys(sort).length) query = query.sort(sort);
      if (take) query = query.limit(take);
      const docs = await query.lean();
      return removeIds(docs as Doc[]);
    },
    async createMany({ data }: { data: Doc[] }): Promise<{ count: number }> {
      const m = await getModel("Notification");
      const docs = data.map(ensureId);
      const dedupeKeys = docs.map((d) => d.dedupeKey).filter(Boolean) as string[];
      if (dedupeKeys.length) {
        const existing = await m.find({ dedupeKey: { $in: dedupeKeys } }, { dedupeKey: 1 }).lean();
        const existingKeys = new Set(existing.map((e: any) => e.dedupeKey));
        const filtered = docs.filter((d) => !existingKeys.has(d.dedupeKey));
        if (!filtered.length) return { count: 0 };
        const inserted = await m.insertMany(filtered);
        return { count: inserted.length };
      }
      const inserted = await m.insertMany(docs);
      return { count: inserted.length };
    },
    async updateMany({ where, data }: { where: Doc; data: Doc }): Promise<{ count: number }> {
      const m = await getModel("Notification");
      const result = await m.updateMany(convertWhere(where), { $set: data });
      return { count: result.modifiedCount };
    }
  }
};

export { prisma };
export function getPrismaClient() { return prisma; }
