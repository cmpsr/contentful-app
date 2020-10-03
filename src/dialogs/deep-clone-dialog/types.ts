export const DEFAULT_LOCALE = "en-US";

export interface Cache {
  [sysId: string]: Entry;
}

export interface FieldLocale {
  sys: {
    id: string;
    linkType: string;
    type: string;
  };
}

export interface Field<T = FieldLocale> {
  [locale: string]: T;
}

export interface Entry {
  fields: {
    [id: string]: Field<FieldLocale[] | FieldLocale>;
  };
  sys: {
    id: string;
    contentType: {
      sys: {
        id: string;
      };
    };
  };
}

export interface ITree {
  entry: Entry;
  children: ITree[];
  entryCache: Cache;
}
