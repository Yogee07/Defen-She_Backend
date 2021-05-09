const express = require("express");
const router = express.Router();
const path = require('path');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('233d7e0f50b8470cbe81df7655a35e3f');
const News = require(path.join(__dirname,'..','..', 'models','feedData'));

async function fetchNewsFeeds(){
    newsapi.v2.everything({q: '(women safety rules OR crime against women OR women security) AND (+indian OR +women OR +woman)',language: 'en', sortBy:'relevancy', page: 1})
    .then((response)=>{
        const newsItem = [];
        News.deleteMany({})
        .then((msg)=>{
            response.articles.forEach(article=>{
                const item = {
                    title: article.title,
                    source: article.source.name,
                    imageUri: article.urlToImage,
                    url: article.url,
                    date: article.publishedAt,
                }
                newsItem.push(item);
            })
            News.insertMany(newsItem)
            .then((resp)=>{
            })
            .catch((err)=>{
            });
            newsapi.v2.everything({q: '(women safety rules OR crime against women OR women security) AND (+indian OR +women OR +woman)',language: 'en', sortBy:'relevancy', page: 2})
            .then((response)=>{
                const newsItem = [];
                response.articles.forEach(article=>{
                    const item = {
                        title: article.title,
                        source: article.source.name,
                        imageUri: article.urlToImage,
                        url: article.url,
                        date: article.publishedAt,
                    }
                    newsItem.push(item);
                })
                News.insertMany(newsItem)
                .then((resp)=>{
                })
                .catch((err)=>{
                });
                newsapi.v2.everything({q: '(women safety rules OR crime against women OR women security) AND (+indian OR +women OR +woman)',language: 'en', sortBy:'relevancy', page: 3})
                .then((response)=>{
                    const newsItem = [];
                    response.articles.forEach(article=>{
                        const item = {
                            title: article.title,
                            source: article.source.name,
                            imageUri: article.urlToImage,
                            url: article.url,
                            date: article.publishedAt,
                        }
                        newsItem.push(item);
                    })
                    News.insertMany(newsItem)
                    .then((resp)=>{
                    })
                    .catch((err)=>{
                    });
                })
                .catch(err=>{
                    console.log(err)
                })
            })
            .catch(err=>{
                console.log(err)
            })
        })
        .catch(err=>{
            console.log("Unable to fetch news")
        });
    })
    .catch(err=>{
        console.log(err)
    })
}
fetchNewsFeeds();
setInterval(fetchNewsFeeds, 2700000);

router.get('/fetch',async (req,res)=>{
    News.find({})
    .then(response=>{
        res.send(response);
    })
    .catch(err=>{
        res.json({})
    })
})

module.exports = router;