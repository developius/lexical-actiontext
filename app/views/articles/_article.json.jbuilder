json.extract! article, :id, :title, :body, :created_at, :updated_at
json.url article_url(article, format: :json)
json.body article.body.to_s
