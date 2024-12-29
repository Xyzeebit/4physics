const DB_NAME = "physics004"


const QUIZ_GENERAL = [
    {
        question: "If a car travels at 200km/hr in 4 hours, what is the average speed",
        options: ["40km/hr", "50km/hr", "60km/hr", "70km/hr"],
        answer: 1
    },
    {
        question: "How long will it take a car of average velocity of 240km/hr to cover a displacement of 20km",
        options: ["100 sec", "200 sec", "300 sec", "400 sec"],
        answer: 2
    },
]

var opt = -1

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
                    general: QUIZ_GENERAL,
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

/**
 * Document Listeners
 */

$(document).ready(function() {

    const db = initSessionStorage();
    console.log(db)

    const quiz = new Set();
    const answers = {}
    console.log(quiz)


    $('.close-btn').on('click', function() {
        $('.bg-overlay').addClass('slide-out')
    })

    $('.open-btn').on('click', function() {
        $('.bg-overlay').removeClass('slide-out')
    })

    addTopicEventListener(db);
    addSelectedTopicListener(db.selected);
    setTopic(db.selected);
    addTopicsButtonListener();
    
    addOptEventListener(answers)
    addNextQuestionEventListListener(quiz, db.questions.general, answers);
    setInitialQuestion(quiz, db.questions.general)
    
    
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
            const topicId = $(this).attr("id");
            let addr = location.href;
            if(addr.indexOf('general') !== -1) {
                addr = location.href.replace("general-physics.html", "general-physics-study.html");
            } else {
                addr = location.href.replace("practical-physics.html", "practical-physics-study.html");
            }
            const topic = $(this).text();
            db.selected = {
                id: topicId,
                topic,
            }
            saveDB(db)
            location.href = addr;
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

function clearOptions() {
    for (let j = 1; j <= 4; j++) {
        $(`.opt-${j}`).removeClass('bg-gray-300').addClass('bg-gray-100');
        $(`.opt-${j} div`).removeClass('bg-green-500').addClass('bg-white')
    }
}

function addOptEventListener(answers) {
    for (let i = 1; i <= 4; i++) {
        $(`.opt-${i}`).on('click', function() {
            clearOptions()            
            $(this).removeClass('bg-gray-100').addClass('bg-gray-300')
            $(`.opt-${i} div`).removeClass('bg-white').addClass('bg-green-500')
            answers[opt] = i - 1
            console.log(answers)
        })
    }

}

function addNextQuestionEventListListener(quiz, questions, answers) {
    
    $('.next-btn').on('click', function() {
        clearOptions()
        if (quiz.size == questions.length) {
            $('.progress-panel').removeClass('hidden')
            $('.quiz-panel').addClass('hidden')
            showQuizProgress(questions, answers)
            opt = -1
        }
        let idx = Math.floor(Math.random() * questions.length)
        while(quiz.has(idx) && quiz.size < questions.length ) {
            idx = Math.floor(Math.random() * questions.length)
        }
        quiz.add(idx)
        opt = idx
        setQuestion(questions[idx])
        $('.quiz-counter').text(`Question ${quiz.size}/${questions.length}`)
    })
}

function setQuestion(quiz) {
    const q = $('.question');
    if (q) {
        q.text(quiz.question)
        for (let i = 0; i <= 4; i++) {
            $(`.opt-${i + 1} span`).text(quiz.options[i])
        }
    }
    
}

function setInitialQuestion(quiz, questions) {
    const q = $('.question');
    if (q) {
        $('.quiz-counter').text(`Question 1/${questions.length}`)
        let idx = Math.floor(Math.random() * questions.length)
        quiz.add(idx)
        opt = idx
        setQuestion(questions[idx])
    }
}


function showQuizProgress(questions, answers) {
    const { correct, wrong, total } = getQuizResult(questions, answers)
    setWrongProgressBar(wrong)
    setCorrectProgressBar(correct)
    setTotalProgressBar(total)
}

function getQuizResult(questions, answers) {
    let c = 0;
    let w = 0;
    let t = questions.length;
    for(let i = 0; i < questions.length; i++) {
        if (answers[i] == questions[i].answer) {
            c++
        } else {
            w++
        }
    }

    return {
        correct: c,
        wrong: w,
        total: t
    }
}

function setWrongProgressBar(w) {
    const container = document.getElementById("wrong")

    const bar = new ProgressBar.SemiCircle(container, {
        strokeWidth: 6,
        color: "#FFEA82",
        trailColor: "#eee",
        trailWidth: 1,
        easing: "easeInOut",
        duration: 1400,
        svgStyle: null,
        text: {
            value: "",
            alignToBottom: false
        },
        from: {
            color: "#FFEA82", //#2c9931
        },
        to: {
            color: "#ED6A5A"
        },
        step: (state, bar) => {
            bar.path.setAttribute('stroke', state.color);
            let value = Math.round(bar.value()*w)
            bar.setText(value)
           
            bar.text.style.color = state.color
            
        }
    });
    bar.text.style.fontFamily = `"Raleway", Helvetica, sanserif`
    bar.text.style.fontSize = '2em'
    bar.animate(1.0)
}

function setCorrectProgressBar(c) {
    const container = document.getElementById("correct")

    const bar = new ProgressBar.SemiCircle(container, {
        strokeWidth: 6,
        color: "#FFEA82",
        trailColor: "#eee",
        trailWidth: 1,
        easing: "easeInOut",
        duration: 1400,
        svgStyle: null,
        text: {
            value: "",
            alignToBottom: false
        },
        from: {
            color: "#FFEA82"
        },
        to: {
            color: "#2c9931"
        },
        step: (state, bar) => {
            bar.path.setAttribute('stroke', state.color);
            let value = Math.round(bar.value()*c)
            bar.setText(value)

            bar.text.style.color = state.color
            
        }
    });
    bar.text.style.fontFamily = `"Raleway", Helvetica, sanserif`
    bar.text.style.fontSize = '2em'
    bar.animate(1.0)
}

function setTotalProgressBar(t) {
    const container = document.getElementById("quizzes")

    const bar = new ProgressBar.Circle(container, {
        strokeWidth: 6,
        color: "#FFEA82",
        trailColor: "#eee",
        trailWidth: 1,
        easing: "easeInOut",
        duration: 1400,
        svgStyle: null,
        text: {
            value: "",
            alignToBottom: false
        },
        from: {
            color: "#FFEA82"
        },
        to: {
            color: "#333"
        },
        step: (state, bar) => {
            bar.path.setAttribute('stroke', state.color);
            let value = Math.round(bar.value()*t)
            bar.setText(value)
            bar.text.style.color = state.color
            
        }
    });
    bar.text.style.fontFamily = `"Raleway", Helvetica, sanserif`
    bar.text.style.fontSize = '4rem'
    bar.animate(1.0)
}