import { uuidv4 } from "../util";
import { Constructor } from "./mixins";

export interface IIdentifiable {
  _id: string;
}

export type Identifiable = Constructor<IIdentifiable>;
export function Identifiable<TBase extends Identifiable>(Base: TBase) {
  return class Identifiable extends Base {
    constructor(..._: any[]) {
      super();
      this._id = uuidv4();
    }
    public get id(): string {
      return this._id;
    }
  };
}
