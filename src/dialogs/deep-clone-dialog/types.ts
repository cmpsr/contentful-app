export const DEFAULT_LOCAL = "en-US";

export type Entry = {
  fields: {
    [id: string]: {
      [DEFAULT_LOCAL]: {
        sys: {
          id: string;
          linkType: string;
          type: string;
        };
      };
    };
  };
  sys: {
    id: string;
    contentType: {
      sys: {
        id: string;
      };
    };
  };
};

export interface ITree {
  entry: Entry;
  children: ITree[];
}
