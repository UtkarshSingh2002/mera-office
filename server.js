const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

try {
     const serviceAccount = {
          "type": "service_account",
          "project_id": "my-tolist",
          "private_key_id": "df97fa60f87b597704d6e0226d27efd5cb059e1d",
          "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDgfBo+EZgrYdxK\n8g9WnTKAD9ykYe63yKeH1wvYHFC2Vs+XYWxbGy96Rvx3in5hKCRnRdUPHpHGPyTj\n2zFccFQnH5a+I44LsXIA92QJ90THFo3kduvG/+ZMFR/oBENx+crPgtfIcbs5CHzt\nBn2pn9MdyseETa2Njn5naOBaCkuvo+CqimOG33YHZ3DrpPZZNhu/vzOyaYzsR0hC\nPKDRkKgcOPjwTs+tPG4bcGKcLkutygqkymBJQzVliX3Zs/XSUUD/H8/RF9bnBUHs\nrqlCC2NkKBTksmMaf9yvjCAeFXALTT5CnW2B6tugGYcuq6yIi1aWp9n2ZLUZS+9X\nuiv8p4iBAgMBAAECggEAGzAgqAeOveNXcErGnYuCqiSxqQWU6VSfqLm8fR85zcmw\nEQIrQtIFMyqtiWdgRNFdLlZUdoUx69gqNkAOB4dxw77FTbBF9AfY2kHcL4JPhcrH\nIuZdyj9kQ67zyzCYABH8NJuA2a2fmqna4oSsm8qIAdXVSgJz7H73c3wN3w3b6pDF\nEvOsApWpaVjo+V3ExXUwmqSkBgxGGiE0DuDdG0L6MSn97CIeODar36Arw2aVmCNS\n/BZ0kkPEXDFBC2ZsiaHijXWTyqnTdz6EmvtjLEP7yP6voAxll3TePJduifKsV+n2\nghwN+emBTnU5TIihjFOhKC7pKcttaDd7Jo3/VKf6KQKBgQDyHf+glgK3cPem1u7R\nYoLxgRorWY0x1gTvJ/wP5Wm6kpohol3ubhM8e6RdnBNRKfn0FA0dmHv40UEbFr8B\nOwMgcg7QmGfW3cK40p1A4jEWdr/aoruAKqPwnW9LeCSJy/eByjZeNaIzR7d84s0O\n3ufSLxW0ay7u92H1LHXYrjD/2QKBgQDtW0fRlEnBAqQ0lfaqQX+m24doSLmVMmnu\nkepbEJpL5lUUs3l2NdCzzDcZ8SpRnh0DsD1j863crHwL7tNFDRPdep4pd+w5M5BG\n5UNLE4CGKwvs2BtmWrmUQbIaXq4uBslT22lgCPo/sfmv5obJI+4slUU8zaSo1qsk\nPshuZMSM6QKBgQCFCo7pAwVDH8Q13W0liWhCpJpor7CybdQQRnxvj7RlXSFs0fej\niMDxP0+2UIkc1GARCuOaG6wjsXiBFiKm3nJ9Za9WWCjXHMxfGvxmJuSqX15VGY7G\ngqfLE/eQFNifD4FVxHPTmM0kOIhPC6F6RmpESLM4jJ0hmrYtLt0iz7UFIQKBgBWt\n+rdX1gy9EwaClA8lAGXbM1kBG4JXInnZ9g/vSkiYdzj206dKbw+dHYNPFdByoq/N\njy3r+ftn/cSRQdbSxPe71WpwO7FV1l3DXwwiceDPWb1+V7JXow+5mGz0LPCjSgxQ\nxCUzbLgYp3e7lKAWmhCUaciN9/Y79VHQMjpzFcjRAoGAUxPUvjQ5Es63gN66rIKG\nhrlY8bQRNPvl32aJUwLrGgc2t4ppE9aoUw/8KHH031unBqE+WlcEKmZEOZGT3f23\n/4G11ujl8VVS3mIOZwoZkQ28WQP/vKrF+9IF2P1mJ/qPQ/iSDuoMgKyX7gRqBrGY\nRgyp/KDhyhkrlJlBGhryMBc=\n-----END PRIVATE KEY-----\n",
          "client_email": "firebase-adminsdk-axw2s@my-tolist.iam.gserviceaccount.com",
          "client_id": "109784662408734682182",
          "auth_uri": "https://accounts.google.com/o/oauth2/auth",
          "token_uri": "https://oauth2.googleapis.com/token",
          "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
          "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-axw2s%40my-tolist.iam.gserviceaccount.com",
          "universe_domain": "googleapis.com"
     };


     admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          // databaseURL: "https://react-task-6-5654c-default-rtdb.asia-southeast1.firebasedatabase.app/"
          databaseURL: "https://my-tolist-default-rtdb.firebaseio.com/"
          
     });


} catch (error) {
     console.error("Error initializing Firebase Admin SDK:", error);
     process.exit(1); // Exits on failure
}

const app = express();
app.use(
     cors({
          origin: "*",
          credentials: true,
     })
);

const db = admin.firestore();

// Fetch all users
app.get("/users", async (req, res) => {
     try {
          const listUsersResult = await admin.auth().listUsers();
          const users = listUsersResult.users.map((user) => ({
               id: user.uid,
               email: user.email,
               password: user.passwordHash,
               signupTime: new Date(user.metadata.creationTime).toLocaleString(),
               ip: user.customClaims?.ip || "192.168.0.1",
          }));
          res.json(users);
     } catch (error) {
          console.error("Error fetching users:", error);
          res.status(500).send("Error fetching users.");
     }
});

// Route to fetch task lists
app.get("/tasklists", async (req, res) => {
     try {
          const listUsersResult = await admin.auth().listUsers();
          const users = await Promise.all(
               listUsersResult.users.map(async (user) => {
                    const userId = user.uid;

                    const todoListsCollection = admin
                         .firestore()
                         .collection("users")
                         .doc(userId)
                         .collection("todoLists");

                    const todoListsSnapshot = await todoListsCollection.get();
                    let totalTask = 0;

                    const todoListsWithTasks = await Promise.all(
                         todoListsSnapshot.docs.map(async (todoListDoc) => {
                              const todoListData = todoListDoc.data();
                              const taskListName = todoListData.name || "Untitled";
                              const createdAt = todoListData.createdAt || "N/A";

                              const tasksCollection = todoListDoc.ref.collection("tasks");
                              const tasksSnapshot = await tasksCollection.get();
                              const noOfTasks = tasksSnapshot.size;
                              totalTask += noOfTasks;

                              const tasks = tasksSnapshot.docs.map((taskDoc) => {
                                   const taskData = taskDoc.data();
                                   return {
                                        taskId: taskDoc.id,
                                        title: taskData.title || "Untitled",
                                        description: taskData.description || "No description",
                                        createdAt: taskData.createdAt || "N/A",
                                   };
                              });

                              return {
                                   todoListId: todoListDoc.id,
                                   name: taskListName,
                                   createdAt: createdAt,
                                   updatedAt: createdAt,
                                   no_of_tasks: noOfTasks,
                                   tasks: tasks,
                              };
                         })
                    );

                    return {
                         id: userId,
                         email: user.email,
                         password: user.passwordHash,
                         todoLists: todoListsWithTasks,
                         TotalTask: totalTask,
                    };
               })
          );

          res.json(users);
     } catch (error) {
          console.error("Error fetching users and tasks:", error);
          res.status(500).send("Error fetching task lists.");
     }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
});