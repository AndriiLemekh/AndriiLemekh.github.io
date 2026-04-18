const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const { FieldValue } = admin.firestore;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Сервер JobFinder працює успішно!");
});

app.post("/api/applications", async (req, res) => {
    const { userId, jobId, jobTitle } = req.body;

    if (!userId || !jobId || !jobTitle) {
        return res.status(400).json({ error: "Не всі дані передані" });
    }

    try {
        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            const appliedJobs = userDoc.data().appliedJobs || [];
            const alreadyApplied = appliedJobs.some(job => job.id === jobId);

            if (alreadyApplied) {
                return res.status(400).json({ error: "Ви вже подали заявку на цю вакансію раніше!" });
            }
        }

        await userRef.set({
            appliedJobs: FieldValue.arrayUnion({ id: jobId, title: jobTitle })
        }, { merge: true });

        res.status(200).json({ message: "Заявку успішно збережено на сервері!" });

    } catch (error) {
        console.error("Помилка сервера:", error);
        res.status(500).json({ error: "Помилка при збереженні бази даних" });
    }
});


app.get("/api/applications/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            const appliedJobs = userDoc.data().appliedJobs || [];
            res.status(200).json(appliedJobs);
        } else {
            res.status(200).json([]);
        }
    } catch (error) {
        console.error("Помилка сервера:", error);
        res.status(500).json({ error: "Помилка при читанні бази даних" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
});