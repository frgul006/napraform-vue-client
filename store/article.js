export const initialState = {
  article: {
    id: "",
    title: "",
    content: "",
    employees: []
  }
};

export const state = () => {
  return { ...initialState };
};

export const mutations = {
  set(state, article) {
    state.article = { ...article };
    console.log("article/set", state);
  },
  clear(state) {
    state.article = initialState.article;
  }
};

export const getters = {
  get: state => {
    console.log("article/get", state);
    return state.article;
  }
};
