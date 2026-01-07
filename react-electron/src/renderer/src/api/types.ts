export interface IQuestionnaire {
    id: number;
    name: string;
    userId: number;
    templates: ITemplate[];
  }
  
  export interface ICreateQuestionnaire {
    name: string;
  }

  export interface IUpdateQuestionnaire {
    name: string;
  }

  export interface ITemplate {
    version: number;
    name: string;
    questionnaireId: number;
  }

  export interface ICreateTemplate {
    questionnaireId: number;
    name: string;
  }

  export interface IUpdateTemplate {
    name: string;
  }