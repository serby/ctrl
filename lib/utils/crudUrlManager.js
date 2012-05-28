var CrudUrlManager = function(baseUrl, subjectSingular, subjectPlural) {
  this.getCrudUrls = function(id) {
    return {
      titleSingular: subjectSingular,
      titlePlural: subjectPlural,
      add: {
        url: baseUrl + 'new',
        title: 'Add a new ' + subjectSingular },
      edit: {
        url: baseUrl + id + '/edit',
        title: 'Edit this ' + subjectSingular },
      'delete': {
        url: baseUrl + id + '/delete',
        title: 'Delete this ' + subjectSingular },
      view: {
        url: baseUrl + id,
        title: 'View this ' + subjectSingular },
      list: {
        url: baseUrl,
        title: 'View all ' + subjectPlural },
      search: {
        url: baseUrl + 'search'
      }
    };
  };
};

module.exports.createCrudUrlManager = function(baseUrl, subjectSingular, subjectPlural) {
  return new CrudUrlManager(baseUrl, subjectSingular, subjectPlural);
};
