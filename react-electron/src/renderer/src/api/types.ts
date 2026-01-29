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
    id: number;
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

  export interface IQuestion {
    id: number;
    text: string;
    templateId: number;
    points?: number;
  }

  export interface ICreateQuestion {
    templateId: number;
    text: string;
  }

  export interface IUpdateQuestion {
    text: string;
  }

  export interface ISubmission {
    id: number;
    date: string;
    userId: number;
    totalPoints: number;
    templateId: number;
    answers: IAnswer[];
  }

  export interface ICreateSubmission {
    templateId: number;
  }

  export interface IAnswer {
    id: number;
    questionId: number;
    submissionId: number;
    points: number;
    text: string;
  }