// initial load
let tasks = [];
let taskName = "";
let onError = false;
let outerLoading = false;
let email = "";
let password = "";
let uid = "";

new Vue({
  el: "#app",
  data: {
    innerLoading: false,
    tasks,
  },
  methods: {
    registerUser: function () {
      auth.createUserWithEmailAndPassword(email, password).then(function () {
        // Declare user variable
        uid = auth.currentUser.uid;
        db.collection(uid)
          .doc("initial-list")
          .set({
            name: "First Item",
            checked: false,
            date: new Date(),
          })
          .then(() => {
            loadTasks(uid);
          });
      });
    },
    loginUser: function () {
      auth.signInWithEmailAndPassword(email, password).then(function () {
        uid = auth.currentUser.uid;
        loadTasks(uid);
      });
    },
    newTask: function () {
      if (!taskName) {
        return;
      }

      this.innerLoading = true;
      onError = false;

      let currentTime = new Date();
      db.collection(uid)
        .add({
          name: taskName,
          date: currentTime,
          checked: false,
        })
        .then((docRef) => {
          tasks.push({
            name: taskName,
            date: currentTime,
            checked: false,
            id: docRef.id,
          });
          taskName = "";
          this.innerLoading = false;
        })
        .catch(() => {
          this.innerLoading = false;
          onError = true;
        });
    },
    deleteTask: function (task) {
      this.innerLoading = true;
      onError = false;

      db.collection(uid)
        .doc(task.id)
        .delete()
        .then(() => {
          tasks.splice(tasks.indexOf(task), 1);
          this.innerLoading = false;
        })
        .catch(() => {
          onError = true;
          this.innerLoading = false;
        });
    },
    checkTask: function (isChecked, id) {
      this.innerLoading = true;
      onError = false;

      const findTask = (element) => element.id == id;
      db.collection(uid)
        .doc(id)
        .update({ checked: isChecked })
        .then(() => {
          tasks[tasks.findIndex(findTask)].checked = isChecked;
          this.innerLoading = false;
        })
        .catch(() => {
          onError = true;
          this.innerLoading = false;
        });
    },
  },
});

function loadTasks(uid) {
  db.collection(uid)
    .orderBy("date", "asc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        tasks.push({
          name: doc.data().name,
          id: doc.id,
          checked: doc.data().checked,
          date: doc.data().date.toDate(),
        });
      });
      outerLoading = false;
    })
    .catch(() => {
      outerLoading = false;
      onError = true;
    });
}
