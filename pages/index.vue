<template>
  <section class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="form-group mt-3">
          <input v-model="query" type="text" class="form-control" placeholder="Search...">
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <ul class="card-columns list-unstyled">
          <li v-for="article in filteredList" :key="article.id" class="card">
            <img :src="article.image.url" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">{{ article.title }}</h5>
              <p class="card-text">{{ article.description || 'No description provided' }}.</p>
              <router-link :to="{ name: 'articles-id', params: { id: article.id }}" tag="a" class="btn btn-primary">
                See dishes
              </router-link>
            </div>
          </li>
          <p v-if="!filteredList.length">No results :(</p>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);
export default {
  data() {
    return {
      query: ""
    };
  },
  computed: {
    filteredList() {
      return this.articles.filter(article => {
        return article.title.toLowerCase().includes(this.query.toLowerCase());
      });
    },
    articles() {
      return this.$store.getters["articles/list"];
    }
  },
  async fetch({ store }) {
    store.commit("articles/emptyList");
    console.log("fetch");
    const response = await strapi.request("post", "/graphql", {
      data: {
        query: `query {
            articles {
              _id
              title
              image {
                url
              }
            }
          }
          `
      }
    });
    response.data.articles.forEach(article => {
      article.image.url = `${apiUrl}${article.image.url}`;
      store.commit("articles/add", {
        id: article.id || article._id,
        ...article
      });
    });
  }
};
</script>
