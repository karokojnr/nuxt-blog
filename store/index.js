import Vuex from 'vuex';
import axios from 'axios';
import Cookie from 'js-cookie';
const createStore = () => {
    return new Vuex.Store({
        state: {
            loadedPosts: [],
            token: null,
        },
        mutations: {
            setPosts(state, posts) {
                state.loadedPosts = posts;
            },
            addPost(state, post) {
                state.loadedPosts.push(push);
            },
            editPost(state, editedPost) {
                const postIndex = state.loadedPosts.findIndex(post => post.id === editedPost.id);
                state.loadedPosts[postIndex] = editedPost;
            },
            setToken(state, token) {
                state.token = token;
            },
            clearToken(state) {
                state.token = null;
            }
        },
        actions: {
            addPost(vuexContext, post) {
                const createdPost = { ...post, updatedDate: new Date() };
                return axios.post(`${process.env.baseUrl}/posts.json?auth=${vuexContext.state.token}`, createdPost)
                    .then(res => {
                        vuexContext.commit('addPost', { ...createdPost, id: res.data.name });
                    })
                    .catch(err => console.log(err));
            },
            editPost(vuexContext, edittedPost) {
                return axios.put(`${process.env.baseUrl}/posts/${edittedPost.id}.json?auth=${vuexContext.state.token}`,
                    edittedPost)
                    .then(result => {
                        vuexContext.commit('editPost', edittedPost);
                    })
                    .catch(err => console.log(err));
            },
            nuxtServerInit(vuexContext, context) {
                return context.app.$axios.$get(`/posts.json`)
                    .then(data => {
                        const postsArray = [];
                        for (const key in data) {
                            postsArray.push({ ...data[key], id: key });
                        }
                        vuexContext.commit('setPosts', postsArray);
                    })
                    .catch(err => context.error(err));
            },
            setPosts(vuexContext) {
                vuexContext.commit('setPosts', posts);
            },
            authenticateUser(vuexContext, authData) {
                let authURL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.firebaseApiKey}`;
                if (!authData.isLogin) {
                    authURL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.firebaseApiKey}`;
                }
                return this.$axios.$post(authURL, {
                    email: authData.email,
                    password: authData.password,
                    returnSecureToken: true,
                }).then(result => {
                    vuexContext.commit('setToken', result.idToken);
                    localStorage.setItem('token', result.idToken);
                    localStorage.setItem('tokenExpiration', new Date().getTime() + Number.parseInt(result.expiresIn) * 1000);
                    Cookie.set('jwt', result.idToken);
                    Cookie.set('expirationDate', new Date().getTime() + Number.parseInt(result.expiresIn) * 1000);
                    // vuexContext.dispatch('setLogoutTimer', result.expiresIn * 1000);
                    return this.$axios.$post('http://localhost:3000/api/track-data', {
                        data: 'Authenticated',
                    });
                }).catch(err => console.log(err));
            },
            setLogoutTimer(vuexContext, duration) {
                setTimeout(() => {
                    vuexContext.commit('clearToken');
                }, duration);
            },
            initAuth(vuexContext, req) {
                let token;
                let expirationDate;
                if (req) {
                    if (!req.headers.cookie) {
                        return;
                    }
                    const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith("jwt="));
                    if (!jwtCookie) {
                        return;
                    }
                    token = jwtCookie.split('=')[1];
                    expirationDate = req.headers.cookie.split(';').find(c => c.trim().startsWith("expirationDate=")).split('=')[1];
                    //--------------------------------------------------------------
                } else {
                    token = localStorage.getItem('token');
                    expirationDate = localStorage.getItem('tokenExpiration');
                }
                if (new Date().getTime() > +expirationDate || !token) {
                    console.log("no token or invalid token");
                    vuexContext.dispatch('logout');//vuexContext.commit('clearToken');
                    return;
                }
                // vuexContext.dispatch('setLogoutTimer', +expirationDate - new Date().getTime());
                vuexContext.commit('setToken', token);
            },
            logout(vuexContext) {
                vuexContext.commit('clearToken');
                Cookie.remove('jwt');
                Cookie.remove('expirationDate');
                if (process.client) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('tokenExpiration');
                }
            }
        },
        getters: {
            loadedPosts(state) {
                return state.loadedPosts;
            },
            isAuthenticated(state) {
                return state.token != null;
            }
        }
    });
};
export default createStore;