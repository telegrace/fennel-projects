/////////////////////////FIRST COMPONENT/////////////////////
Vue.component("my-first-component", {
    template: "#my-component-template",
    data: function () {
        return {
            image: "",
            url: "",
            title: "",
            description: "",
            username: "",
            created_at: "",
        };
    },
    props: ["imgId", "justAnotherProp"],
    mounted: function () {
        console.log("this.imgId in component:", this.imgId);
        console.log("this.justAnotherProp:", this.justAnotherProp);
        var self = this;
        axios
            .get("/images/" + this.imgId)
            .then(function (response) {
                self.image = response.data.image;
                console.log(self.image);
                self.url = self.image.url;
                self.title = self.image.title;
                self.description = self.image.description;
                self.username = self.image.username;
                self.created_at = self.image.created_at;
            })
            .catch(function (err) {
                console.log("error in axios", err);
            });
    },
    watch: {
        imgId: function () {
            console.log("watch");
            var self = this;
            axios
                .get("/images/" + this.imgId)
                .then(function (response) {
                    self.image = response.data.image;
                    console.log(self.image);
                    self.url = self.image.url;
                    self.title = self.image.title;
                    self.description = self.image.description;
                    self.username = self.image.username;
                    self.created_at = self.image.created_at;
                })
                .catch(function (err) {
                    console.log("error in axios", err);
                });
        },
    },

    methods: {
        notifyParentToDoSth: function () {
            console.log(
                "hey component here, I want the main vue instance to know it should do sth!"
            );
            this.$emit("close");
        },
    },
});

/////////////////////////END OF FIRST COMPONENT/////////////////////

/////////////////////////SECOND COMPONENT/////////////////////
Vue.component("my-second-component", {
    template: "#my-comment-template",
    data: function () {
        return {
            name: "Graces",
            comments: [],
            author: "",
            comment: "",
        };
    },

    props: ["imgId"],
    mounted: function () {
        console.log("this.imgId in comments component:", this.imgId);
        var self = this;
        axios
            .get("/get-comments/" + this.imgId)
            .then(function (response) {
                console.log("Get comments response: ", response);
                self.comments = response.data.comments;
            })
            .catch(function (err) {
                console.log("error in axios", err);
            });
    },

    // watch: {
    //     imgId: function () {
    //         console.log("comments imgId changed to:", this.imgId);
    //         var self = this;
    //         axios
    //             .get("/get-comments/" + this.imgId)
    //             .then(function (response) {
    //                 console.log("Get comments response: ", response);
    //             })
    //             .catch(function (err) {
    //                 console.log("error in axios", err);
    //             });
    //     },
    // },

    methods: {
        addComment: function () {
            console.log("id of image to add comment:", this.imgId);
            var self = this;
            var fullComment = {
                id: this.imgId,
                comment: this.comment,
                author: this.author,
            };
            axios
                .post("/comment", fullComment)
                .then(function (response) {
                    let newComment = response.data.comments;
                    console.log(newComment);
                    self.comments.push(newComment);
                })
                .catch(function (err) {
                    console.log("Error in getting all comments:", err.message);
                });
        },
    },
});
/////////////////////////END OF SECOND COMPONENT/////////////////////

////////////////////MAIN VUE - NO NESTED CHILDREN//////////////////////////////

new Vue({
    el: "#container",
    //first child will be watched by Vue, automatically changed
    data: {
        images: [],
        title: "",
        description: "",
        username: "",
        file: null,
        imgSelected: location.hash.slice(1),
        more: true,
        //this needs to be dynamic
        lowestId: 1,
        notOne: 0,
    },
    mounted: function () {
        console.log("my main vue instance has mounted!");
        var self = this;
        window.addEventListener("hashchange", function () {
            console.log("hashchange");
            self.imgSelected = location.hash.slice(1);
        });

        axios
            .get("/images")
            .then(function (response) {
                self.images = response.data;
            })
            .catch(function (err) {
                console.log("error in axios", err);
            });
    },

    methods: {
        handleUploadClick: function (e) {
            e.preventDefault();
            var formData = new FormData();
            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("username", this.username);
            formData.append("file", this.file);

            var self = this;
            axios
                .post("/upload", formData)
                .then(function (formDataResponse) {
                    //console.log("response from post req: ", formDataResponse);
                    const { data } = formDataResponse;
                    console.log(data.image);
                    // need destruct the response and push the response obj
                    console.log(self);
                    self.images.unshift(data.image);
                    self.images.pop();
                })
                .catch(function (err) {
                    console.log("error from post req", err);
                });
        },
        handleChange: function (e) {
            console.log("handle change is running!");
            this.file = e.target.files[0];
        },
        //what is the lastID (smallestId) on the page
        nextImages: function () {
            let lastId = this.images[this.images.length - 1].id;
            console.log("This is next images");
            var self = this;
            axios
                .get("/next/" + lastId)
                .then(function (response) {
                    const { data } = response;
                    console.log(data.more);
                    if (data.more === false) {
                        self.more = data.more;
                    }
                    self.images = [...self.images, ...data.images];
                })
                .catch(function (err) {
                    console.log("error in axios", err);
                });
        },

        imageBack: function () {
            console.log("back images");
        },
        imageNext: function () {
            console.log("next image");
        },

        selectImg: function (id) {
            console.log("user selected an img-card with img id:", id);
            this.imgSelected = id;
        },
        closeComponent: function () {
            console.log("closeComponent");
            location.hash = "";
        },
    },
});
