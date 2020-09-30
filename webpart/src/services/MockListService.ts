import { IdeaResult } from "../models/IdeaResult";
import { IIdea } from "../models/IIdea";
import { IListService } from "./IListService";

export class MockListService implements IListService {
  public async getIdea(id: any): Promise<IIdea> {
    const idea: IIdea = {
      id,
      title: 'New equipment for accounting',
      fileName: `Idea_${id}_Improvement_in_Accounting`,
      state: 'Active',
      submitter: 'Alfreda Davis',
      supervisor: 'Bennett Fulkerson',
      department: 'Controlling',
      location: 'Vienna',
      currentSituation: 'The frame of the abacus is wiggly and we keep loosing pearls!',
      ideaText: 'investing in some modern calculators would greatly improve our efficiency.',
      attachment: null
    };
    return Promise.resolve(idea);
  }

  public async addIdea(values): Promise<void> {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
    }, 400);
    return Promise.resolve();
  }

  public async decideIdea(id: number, result: IdeaResult): Promise<void> {
    console.log('Decided over Idea:', result);
    return Promise.resolve();
  }

  public async getDepartments(): Promise<string[]> {
    const departments = ['Human Resources', 'Controlling', 'IT', 'Research'];
    return Promise.resolve(departments);
  }

  public async getLocations(): Promise<string[]> {
    const locations = ['Vienna', 'Linz', 'Innsbruck'];
    return Promise.resolve(locations);
  }
}