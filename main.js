// initial load
let tasks = [];
let inputName = "";
let onError = false;
let outerLoading = true;
loadTasks();

new Vue({
  el: "#tasklist",
  data: {
    innerLoading: false,
    tasks,
  },
  methods: {
    newTask: function () {
      if (!inputName) {
        return;
      }

      this.innerLoading = true;
      onError = false;

      let currentTime = new Date();
      db.collection("todo-items")
        .add({
          name: inputName,
          date: currentTime,
          checked: false,
        })
        .then((docRef) => {
          tasks.push({
            name: inputName,
            date: currentTime,
            checked: false,
            id: docRef.id,
          });
          inputName = "";
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

      db.collection("todo-items")
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
      db.collection("todo-items")
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

function loadTasks() {
  db.collection("todo-items")
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
