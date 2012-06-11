db.article.find().forEach(function(article) {
  article.publishedDate = article.created;
  db.article.save(article);
});