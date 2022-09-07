// initial load
let tasks = [];
let inputName = "";
let onError = false;
let isLoading = true;
loadTasks();

new Vue({
  el: "#tasklist",
  data: {
    tasks,
  },
  methods: {
    newTask: function () {
      if (!inputName) {
        return;
      }
      updateTasks(inputName);
      inputName = "";
    },
    deleteTask: function (task) {
      removeTask(task);
    },
  },
});

function loadTasks() {
  onError = false;
  db.collection("todo-items")
    .orderBy("date", "asc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        tasks.push({
          name: doc.data().name,
          id: doc.id,
          date: doc.data().date.toDate(),
        });
      });
      isLoading = false;
    })
    .catch(() => {
      isLoading = false;
      onError = true;
    });
}

function updateTasks(inputName) {
  onError = false;
  let currentTime = new Date();
  db.collection("todo-items")
    .add({
      name: inputName,
      date: currentTime,
    })
    .then((docRef) => {
      tasks.push({
        name: inputName,
        date: currentTime,
        id: docRef.id,
      });})
    .catch(() => {
      onError = true;
    });
}

function removeTask(task) {
  onError = false;
  db.collection("todo-items")
    .doc(task.id)
    .delete()
    .then(() => {
      tasks.splice(tasks.indexOf(task), 1);
    })
    .catch(() => {
      onError = true;
    });
}
