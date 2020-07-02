export interface BasicUnitOfModel {
  from: {
    parents: Array<any>;
  };

  to: {
    parents: Array<any>;
    value: string;
    valueTable: any;
    valueReplace: {
      searchValue: any;
      newValue: any;
    };
  };
}
