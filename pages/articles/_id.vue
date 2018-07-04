<template>
  <section class="container">
    <div>
      <h1 class="mt-2">{{article.title}}</h1>
      <div class="row">
        <div class="col">

          <vue-markdown> {{article.content}}</vue-markdown>

        </div>
      </div>
      <div class="row">
        <div class="col-md-8">
          <div class="card-columns">
            <div v-for="employee in article.employees" :key="employee.id" class="card">
              <img :src="employee.picture.url" class="card-img-top" alt="Card image cap">
              <div class="card-body">
                <h5 class="card-title">{{ employee.firstname }} {{ employee.lastname }}</h5>
                <p class="card-text">{{ employee.email }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Strapi from "strapi-sdk-javascript/build/main";
import VueMarkdown from "vue-markdown";

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);
export default {
  components: {
    VueMarkdown
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    article() {
      return this.$store.getters["article/get"];
    }
  },
  async fetch({ store, params }) {
    store.commit("article/clear");
    const response = await strapi.request("post", "/graphql", {
      data: {
        query: `query
        {
            article(id: "${params.id}") {
              _id
              title,
              content
              employees {
                _id
                firstname
                lastname
                email
                lastname
                picture {
                  url
                }
              }
            }
          }
          `
      }
    });
    response.data.article.employees.forEach(employee => {
      employee.picture.url = `${apiUrl}${employee.picture.url}`;
    });
    const article = response.data.article;
    console.log(article);
    store.commit("article/set", {
      id: article.id || article._id,
      ...article
    });
  }
};
</script>
