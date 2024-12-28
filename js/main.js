const DB_NAME = "physics004"

function initSessionStorage() {
    try {
        const session = localStorage.getItem(DB_NAME);
        if (session) {
            const db = JSON.parse(session);
            return db;
        } else {
            let db = {}
            db = {
                user: {
                    id: "",
                    firstname: "",
                    lastname: "",
                    is_logged_in: false,
                },
                quiz: {
                    total_quiz: 0,
                    total_taken: 0,
                    total_pass: 0,
                    total_fail: 0,
                },
                selected: {
                    course: 0, // general physics
                    id: "" // course button id no
                },
                questions: {
                    general: [],
                    practical: []
                }


            }
            const data = JSON.stringify(db)
            localStorage.setItem(DB_NAME, data)
            return db
        }
    } catch (error) {
        return null
    }
}

function saveDB(db) {
    try {
        const data = JSON.stringify(db)
        localStorage.setItem(DB_NAME, data)
    } catch (error) {
        // do something
    }
}

function getDB() {
    try {
        const db = localStorage.getItem(DB_NAME)
        const data = JSON.parse(db);
        return data;
    } catch (error) {
        return null;
    }
}

$(document).ready(function() {

    const db = initSessionStorage();
    console.log(db)



    $('.close-btn').on('click', function() {
        $('.bg-overlay').hide(200)
    })

    $('.open-btn').on('click', function() {
        $('.bg-overlay').show('slow')
    })

    addTopicEventListener(db);
    addSelectedTopicListener(db.selected);
    setTopic(db.selected);
    addTopicsButtonListener();

})

function setTopic(selected) {
    const header = $(".course-topic")
    if (header) {
        header.text(selected.topic)
    }
}

function addTopicEventListener(db) {
    const generalTopics = $("#topics button");
    const studyTopics = $(".topics li");

    if (generalTopics) {
        generalTopics.on("click", function() {
            const topicId = $(this).attr("id")
            const link = location.href.replace("general-physics.html", "general-physics-study.html");
            const topic = $(this).text();
            db.selected = {
                id: topicId,
                topic,
            }
            saveDB(db)
            location.href = link;
        })
    }
    if (studyTopics) {
        studyTopics.on("click", function() {
            const topicId = $(this).attr("id")
            const topic = $(this).text();
            db.selected = {
                id: topicId,
                topic,
            }
            saveDB(db)
            location.reload()
        })
    }
}

function addSelectedTopicListener(selected) {
    if(location.href.indexOf("study") !== -1) {
        let items = $(`#${selected.id}`).addClass('selected')
    }
}

function addTopicsButtonListener() {
    $('.topics-btn').on('click', function() {
        $('.course-list').toggleClass('hide-sm')
    })
}