import { IdeaResult } from "../models/IdeaResult";
import { IIdea } from "../models/IIdea";

export interface IListService {
  getIdea(id: number): Promise<IIdea>;
  addIdea(values): Promise<void>;
  decideIdea(id: number, result: IdeaResult): Promise<void>;
  getIdea(id: number): Promise<IIdea>;
  getDepartments(): Promise<string[]>;
  getLocations(): Promise<string[]>;
}