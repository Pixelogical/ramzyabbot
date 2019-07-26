const Group = require('./Group')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const bot = new Telegraf('947041182:AAGHj9uUinzWKnEm93uTUhATJxWqs5hmcSk')

var user1 = -1
// var hearts = { "heart_red": "❤️", "heart_orange": "🧡", "heart_yellow": "💛", "heart_green": "💚", "heart_blue": "💙", "heart_purple": "💜", "heart_black": "🖤", "heart_pink": "💖" }
var hearts = {
    "heart_red": " 0 ", "heart_orange": " 1 ", "heart_yellow": " 2 ",
    "heart_green": " 3 ", "heart_blue": " 4 ", "heart_purple": " 5 ", "heart_black": " 6 ", "heart_pink": " 7 "
}
// const sym_white = "️⚪️";
const sym_white = "️ •  ";
var groupQueue = {}


const STRING_CHOOSE_HASH = "یه رمز 4 رقمی تعیین کن 🔐"
const STRING_SUPPORT_CHANNEL = "برای حمایت از پشتیبانی به کانال زیر جوین شو :\n t.me/wikitick"
const STRING_WAIT_OPONENT = " وایسا حریف رمزشو تعیین کنه"
const STRING_DELETE_ERROR = "هنوز چیزی وارد نکردی"
const STRING_ACCEPT_ERROR = "رمز کامل نیس"
const STRING_START_ERROR = "منتظر دوستت باش"
const STRING_EXTERNAL_ERROR = "برای شروع بازی آیدی رباتو لمس کن"
const STRING_STATUS_START = "قفل شد"
const STRING_DUPPLICATE_ERROR = "تکرار مجاز نیس"
const STRING_TURN_ERROR = "نوبت شما نیست"
function STRING_STATUS_TIE(hash, group) { return `مساوی! همزمان رمزو پیدا کردین \n رمز: ${hash}\n${group.inputs}\n`; }
function STRING_STATUS_WIN1(hash, group) { return `برنده ی بازی : : ${group.username1}\n رمز : ${hash}\n${group.inputs}\n`; }
function STRING_STATUS_WIN2(hash, group) { return `برنده ی بازی : : ${group.username2}\n رمز : ${hash}\n${group.inputs}\n`; }

const keyboardss = Markup.inlineKeyboard([
    // Markup.urlButton('❤️', 'http://telegraf.js.org'),
    Markup.callbackButton(hearts.heart_red, 'heart_red'),
    Markup.callbackButton(hearts.heart_orange, 'heart_orange'),
    Markup.callbackButton(hearts.heart_yellow, 'heart_yellow'),
    Markup.callbackButton(hearts.heart_green, 'heart_green'),
    Markup.callbackButton(hearts.heart_blue, 'heart_blue'),
    Markup.callbackButton(hearts.heart_purple, 'heart_purple'),
    Markup.callbackButton(hearts.heart_black, 'heart_black'),
    Markup.callbackButton(hearts.heart_pink, 'heart_pink'),
], { columns: 4 })

const gameKeys = Markup.inlineKeyboard([
    Markup.callbackButton(hearts.heart_red, 'game_red'),
    Markup.callbackButton(hearts.heart_orange, 'game_orange'),
    Markup.callbackButton(hearts.heart_yellow, 'game_yellow'),
    Markup.callbackButton(hearts.heart_green, 'game_green'),
    Markup.callbackButton(hearts.heart_blue, 'game_blue'),
    Markup.callbackButton(hearts.heart_purple, 'game_purple'),
    Markup.callbackButton(hearts.heart_black, 'game_black'),
    Markup.callbackButton(hearts.heart_pink, 'game_pink'),
    Markup.callbackButton("👀", 'reveal'),
    Markup.callbackButton("❌", 'delete'),
    Markup.callbackButton("✅", 'accept'),
], { columns: 4 })


console.log("dare mirize...")


bot.start((ctx) => ctx.reply('Welcome!'))
bot.on('message', (ctx) => {
    console.log(ctx.update.message.entities)
})

bot.on('callback_query', async (ctx) => {
    if (!ctx.callbackQuery.data) {
        return
    }
    IMessageID = ctx.callbackQuery.inline_message_id;
    group = null;
    if (IMessageID in groupQueue) {
        group = groupQueue[IMessageID]
    } else {
        var group = new Group(IMessageID);
        groupQueue[IMessageID] = group;
    }
    if (ctx.callbackQuery.data.includes("ramzyab")) {
        if (ctx.callbackQuery.data.includes("ramzyab0"))
            group.dupplicate = 0;
        else if (ctx.callbackQuery.data.includes("ramzyab1"))
            group.dupplicate = 1;

        var userData1 = JSON.parse(ctx.callbackQuery.data.split("::")[1]);
        group.user1 = userData1["user1"];
        group.username1 = userData1["username1"];
        for (var i = 0; i < 15; i++) {
            group.input1[i][0] = sym_white
            group.input1[i][1] = sym_white
            group.input1[i][2] = sym_white
            group.input1[i][3] = sym_white
            group.input1[i][4] = " "
            group.input1[i][5] = " "

            group.input2[i][0] = sym_white
            group.input2[i][1] = sym_white
            group.input2[i][2] = sym_white
            group.input2[i][3] = sym_white
            group.input2[i][4] = " "
            group.input2[i][5] = " "
        }
        if (group.user1 != -1 || group.user2 != -1) {
            console.log("user not null")
            if (group.user1 != ctx.from.id) {
                // ctx.telegram.answerCbQuery(ctx.callbackQuery.id, group.user2, true)
                bot.telegram.getChatMember("@wikitick", ctx.from.id).then((ctx2) => {
                    if (ctx2.status == "member" || ctx2.status == "administrator") {
                        group.user2 = ctx.from.id
                        group.username2 = ctx.from.first_name
                        var body = STRING_CHOOSE_HASH;
                        bot.telegram.editMessageText("", "", group.IMessageID, body, Extra.markup(keyboardss));
                    } else {
                        ctx.telegram.answerCbQuery(ctx.callbackQuery.id, STRING_SUPPORT_CHANNEL, true)
                    }
                })
            }
            else {
                ctx.telegram.answerCbQuery(ctx.callbackQuery.id, STRING_START_ERROR)
            }
        }
    } else if (ctx.callbackQuery.data.includes("heart")) {
        addHash(ctx, group)
    } else if (group.turn == ctx.from.id && ctx.callbackQuery.data.includes("game")) {
        playing(ctx, group)
    } else if (group.turn == ctx.from.id && ctx.callbackQuery.data.includes("accept")) {
        accept(ctx, group)
    } else if (group.turn == ctx.from.id && ctx.callbackQuery.data.includes("delete")) {
        deleteRow(ctx, group)
    } else if (ctx.callbackQuery.data.includes("reveal")) {
        reveal(ctx, group)
    } else if (group.turn != ctx.from.id && (ctx.from.id == group.user1 || ctx.from.id == group.user2)) {
        ctx.telegram.answerCbQuery(ctx.callbackQuery.id, STRING_TURN_ERROR)
    } else {
        ctx.telegram.answerCbQuery(ctx.callbackQuery.id, STRING_EXTERNAL_ERROR)
    }
    // Explicit usage
    // ctx.telegram.answerCbQuery(ctx.callbackQuery.id, "TEST")

    // Using shortcut
    // ctx.answerCbQuery()
})

bot.on('inline_query', async (ctx) => {
    console.log("In the inline query . . .");
    user1 = ctx.from.id
    username1 = ctx.from.first_name
    userData1 = { "user1": user1, "username1": username1 };
    console.log(user1)
    const results = ([{
        type: 'article',
        id: "759150",
        thumb_url: "http://assets.funnygames.org/games/assets/screenshots/6/112626/91055/mastermind-online-oss-382976.jpg?r=1504694223018",
        photo_width: 10,
        photo_height: 10,
        title: "🔎 رمز یاب",
        description: "بدون تکرار",
        parse_mode: "Markdown",
        input_message_content: { message_text: "input_message_content <a href='https://s3.amazonaws.com/cloud.minroob.com/img/intro-small-w.jpg'> </a>", parse_mode: "HTML" },
        reply_markup: {
            "inline_keyboard": [[
                {
                    "text": "باشه، بزن بریم",
                    "callback_data": "ramzyab0::" + JSON.stringify(userData1)
                }
                // ,{
                //     "text": "هرکی 25 شد برنده س",
                //     "callback_data": "startpoint::" + JSON.stringify(userData1)
                // }
            ]]
        }
    }, {
        type: 'article',
        id: "759151",
        thumb_url: "http://assets.funnygames.org/games/assets/screenshots/6/112626/91055/mastermind-online-oss-382976.jpg?r=1504694223018",
        photo_width: 10,
        photo_height: 10,
        title: "🔎 رمز یاب",
        description: "با تکرار",
        parse_mode: "Markdown",
        input_message_content: { message_text: "input_message_content <a href='https://s3.amazonaws.com/cloud.minroob.com/img/intro-small-w.jpg'> </a>", parse_mode: "HTML" },
        reply_markup: {
            "inline_keyboard": [[
                {
                    "text": "باشه، بزن بریم",
                    "callback_data": "startgame::" + JSON.stringify(userData1)
                }
                // ,{
                //     "text": "هرکی 25 شد برنده س",
                //     "callback_data": "startpoint::" + JSON.stringify(userData1)
                // }
            ]]
        }
    }
    // , {
    //     type: 'article',
    //     id: "759152",
    //     thumb_url: "http://assets.funnygames.org/games/assets/screenshots/6/112626/91055/mastermind-online-oss-382976.jpg?r=1504694223018",
    //     photo_width: 10,
    //     photo_height: 10,
    //     title: "مرموز 🚩",
    //     description: "بدون تکرار\nهرکی 25 امتیاز بگیره برنده س",
    //     parse_mode: "Markdown",
    //     input_message_content: { message_text: "input_message_content <a href='https://s3.amazonaws.com/cloud.minroob.com/img/intro-small-w.jpg'> </a>", parse_mode: "HTML" },
    //     reply_markup: {
    //         "inline_keyboard": [[
    //             {
    //                 "text": "باشه، بزن بریم",
    //                 "callback_data": "startgame::" + JSON.stringify(userData1)
    //             }
    //             // ,{
    //             //     "text": "هرکی 25 شد برنده س",
    //             //     "callback_data": "startpoint::" + JSON.stringify(userData1)
    //             // }
    //         ]]
    //     }
    // }, {
    //     type: 'article',
    //     id: "759153",
    //     thumb_url: "http://assets.funnygames.org/games/assets/screenshots/6/112626/91055/mastermind-online-oss-382976.jpg?r=1504694223018",
    //     photo_width: 10,
    //     photo_height: 10,
    //     title: "مرموز 🚩",
    //     description: "با تکرار - تا 25 امتیاز",
    //     parse_mode: "Markdown",
    //     input_message_content: { message_text: "input_message_content <a href='https://s3.amazonaws.com/cloud.minroob.com/img/intro-small-w.jpg'> </a>", parse_mode: "HTML" },
    //     reply_markup: {
    //         "inline_keyboard": [[
    //             {
    //                 "text": "باشه، بزن بریم",
    //                 "callback_data": "startgame::" + JSON.stringify(userData1)
    //             }
    //             // ,{
    //             //     "text": "هرکی 25 شد برنده س",
    //             //     "callback_data": "startpoint::" + JSON.stringify(userData1)
    //             // }
    //         ]]
    //     }
    // }
])
    return ctx.answerInlineQuery(results, { is_personal: true, cache_time: 0 })
})

function deleteRow(ctx, group) {
    if (group.turn == group.user1) {
        if (group.currentInput1.length < 1) ctx.telegram.answerCbQuery(ctx.callbackQuery.id, STRING_DELETE_ERROR)
        else {
            group.currentInput1 = []
            for (i = 0; i < 4; i++) {
                group.input1[group.row1][i] = sym_white
            }
            group.col1 = 0;
            updateBoard(group);
        }
    } else {
        if (group.currentInput2.length < 1) ctx.telegram.answerCbQuery(ctx.callbackQuery.id, STRING_DELETE_ERROR)
        else {
            group.currentInput2 = []
            for (i = 0; i < 4; i++) {
                group.input2[group.row2][i] = sym_white
            }
            group.col2 = 0;
            updateBoard(group);
        }
    }
}
function reveal(ctx, group) {
    hash = "";
    if (group.user1 == ctx.from.id) {
        for (i = 0; i < 4; i++) {
            hash += hearts[group.hash1[i]] + " ";
        }
    } else {
        for (i = 0; i < 4; i++) {
            hash += hearts[group.hash2[i]] + " ";
        }
    }
    ctx.telegram.answerCbQuery(ctx.callbackQuery.id, hash);
}
function accept(ctx, group) {
    if (group.turn == group.user1) {
        if (group.currentInput1.length < 4) ctx.telegram.answerCbQuery(ctx.callbackQuery.id, STRING_ACCEPT_ERROR)
        else {
            for (i = 0; i < 4; i++) {
                group.currentHash = group.hash2[i]
                if (group.currentInput1.includes(group.currentHash)) {
                    console.log("pc")
                    group.pc1++;
                }
                if (group.currentInput1[i] == group.currentHash) {
                    console.log("pp")
                    group.pp1++;
                }
            }
            group.pc1 -= group.pp1;
            group.round1++;
            if (group.pp1 == 4 && group.win) {
                var hash = ""
                for (i = 0; i < 4; i++) {
                    hash += group.hash2[i]
                }
                updateInputs(group);
                group.board = STRING_STATUS_TIE(hash, group)
                bot.telegram.editMessageText("", "", group.IMessageID, group.board);
                restart(group)
            } else if (group.win) {
                var hash = ""
                for (i = 0; i < 4; i++) {
                    hash += group.hash2[i]
                }
                updateInputs(group);
                group.board = STRING_STATUS_WIN2(hash, group)
                bot.telegram.editMessageText("", "", group.IMessageID, group.board);
                restart(group)
            } else if (group.pp1 == 4 && group.round1 == group.round2) {
                var hash = ""
                for (i = 0; i < 4; i++) {
                    hash += group.hash2[i]
                }
                updateInputs(group);
                group.board = STRING_STATUS_WIN1(hash, group)
                bot.telegram.editMessageText("", "", group.IMessageID, group.board);
                restart(group)
            } else {
                if (group.pp1 == 4) group.win = true;
                for (i = 0; i < group.pc1; i++)
                    group.input1[group.row1][4] += " ◎"
                for (i = 0; i < group.pp1; i++)
                    group.input1[group.row1][4] += " ●"
                group.col1 = 0;
                group.row1++;
                group.currentInput1 = []
                group.turn = group.user2;
                group.pc1 = 0;
                group.pp1 = 0;
                updateBoard(group);
            }
        }
    } else {
        if (group.currentInput2.length < 4) ctx.telegram.answerCbQuery(ctx.callbackQuery.id, STRING_ACCEPT_ERROR)
        else {
            for (i = 0; i < 4; i++) {
                group.currentHash = group.hash1[i]
                if (group.currentInput2.includes(group.currentHash)) {
                    console.log("pc")
                    group.pc2++;
                }
                if (group.currentInput2[i] == group.currentHash) {
                    console.log("pp")
                    group.pp2++;
                }
            }
            group.pc2 -= group.pp2;
            group.round2++;
            if (group.pp2 == 4 && group.win) {
                var hash = ""
                for (i = 0; i < 4; i++) {
                    hash += hearts[group.hash1[i]]
                }
                updateInputs(group);
                group.board = STRING_STATUS_TIE(hash, group)
                bot.telegram.editMessageText("", "", group.IMessageID, group.board);
                restart(group)
            } else if (group.win) {
                var hash = ""
                for (i = 0; i < 4; i++) {
                    hash += group.hash2[i]
                }
                updateInputs(group);
                group.board = STRING_STATUS_WIN1(hash, group)
                bot.telegram.editMessageText("", "", group.IMessageID, group.board);
                restart(group)
            } else if (group.pp2 == 4 && group.round1 == group.round2) {
                var hash = ""
                for (i = 0; i < 4; i++) {
                    hash += hearts[group.hash1[i]]
                }
                updateInputs(group);
                group.board = STRING_STATUS_WIN2(hash, group)
                bot.telegram.editMessageText("", "", group.IMessageID, group.board);
                restart(group)
            } else {
                if (group.pp2 == 4) group.win = true;
                for (i = 0; i < group.pc2; i++)
                    group.input2[group.row2][4] += " ◎"
                for (i = 0; i < group.pp2; i++)
                    group.input2[group.row2][4] += " ●"
                group.col2 = 0;
                group.row2++;
                group.currentInput2 = []
                group.turn = group.user1;
                group.pc2 = 0;
                group.pp2 = 0;
                updateBoard(group);
            }
        }
    }
}
function updateBoard(group) {
    updateInputs(group);
    group.board = `⌡ نوبت ${(group.turn == group.user1) ? group.username1 : group.username2} ⌠\n\nرنگ درست : ◎\nرنگ و جای درست: ●\n\n${group.inputs}\n`
    bot.telegram.editMessageText("", "", group.IMessageID, group.board, Extra.markup(gameKeys));
}
function playing(ctx, group) {
    console.log("playing...")
    q = ctx.callbackQuery.data
    if (ctx.from.id == group.user1) {
        if (group.col1 > 3) { ctx.telegram.answerCbQuery(ctx.callbackQuery.id, "Tayid kon") }
        else {
            console.log("user1 running. . .");
            var heartIndex = "heart_" + q.split("_")[1];
            group.input1[group.row1][group.col1] = hearts[heartIndex]
            group.currentInput1.push(heartIndex)
            group.col1++;
            updateBoard(group)
        }
    } else {
        if (group.col2 > 3) { ctx.telegram.answerCbQuery(ctx.callbackQuery.id, "Tayid kon") }
        else {
            console.log("user2 running. . .");
            var heartIndex = "heart_" + q.split("_")[1];
            group.input2[group.row2][group.col2] = hearts[heartIndex]
            group.currentInput2.push(heartIndex)
            group.col2++;
            updateBoard(group)
        }
    }
}
function startGame(group) {
    group.turn = group.user1;
    bordRow = `\n${sym_white} ${sym_white} ${sym_white}`
    updateBoard(group)
}
function restart(group) {
    IMessageID = group.IMessageID
    delete groupQueue[IMessageID]
    group = new Group(IMessageID);
}
function updateInputs(group) {
    group.inputs = ""
    group.inputs += `l▬▬▬▬( ${group.username1.substring(0, 12)} )▬▬▬▬l\n`;
    for (var i = 0; i < group.row1 + 1; i++) {
        group.inputs += group.input1[i][0] + " ";
        group.inputs += group.input1[i][1] + " ";
        group.inputs += group.input1[i][2] + " ";
        group.inputs += group.input1[i][3] + "  ";
        group.inputs += group.input1[i][4] + " ";
        group.inputs += group.input1[i][5] + " \n";
    }
    group.inputs += `l▬▬▬▬( ${group.username2.substring(0, 12)} )▬▬▬▬l\n`;
    for (var i = 0; i < group.row2 + 1; i++) {
        group.inputs += group.input2[i][0] + " ";
        group.inputs += group.input2[i][1] + " ";
        group.inputs += group.input2[i][2] + " ";
        group.inputs += group.input2[i][3] + "  ";
        group.inputs += group.input2[i][4] + " ";
        group.inputs += group.input2[i][5] + " \n";
    }
}
function addHash(ctx, group) {
    if (group.user1 == ctx.from.id) {
        if (group.hash1.length < 4) {
            if (group.dupplicate == 0 && group.hash1.includes(ctx.callbackQuery.data))
                ctx.telegram.answerCbQuery(ctx.callbackQuery.id, STRING_DUPPLICATE_ERROR)
            else
                group.hash1.push(ctx.callbackQuery.data);
            var userHash = ""
            for (var i in group.hash1) {
                userHash += hearts[group.hash1[i]];
            }
            ctx.telegram.answerCbQuery(ctx.callbackQuery.id, userHash)
        } else {
            ctx.telegram.answerCbQuery(ctx.callbackQuery.id, STRING_WAIT_OPONENT)
        }
    } else {
        if (group.hash2.length < 4) {
            if (group.dupplicate == 0 && group.hash2.includes(ctx.callbackQuery.data))
                ctx.telegram.answerCbQuery(ctx.callbackQuery.id, STRING_DUPPLICATE_ERROR)
            else
                group.hash2.push(ctx.callbackQuery.data);
            var userHash = ""
            for (var i in group.hash2) {
                userHash += hearts[group.hash2[i]];
            }
            ctx.telegram.answerCbQuery(ctx.callbackQuery.id, userHash)
        } else {
            ctx.telegram.answerCbQuery(ctx.callbackQuery.id, STRING_WAIT_OPONENT)
        }
    }
    if (group.hash1.length == 4 && group.hash2.length == 4) {
        startGame(group)
        ctx.telegram.answerCbQuery(ctx.callbackQuery.id, STRING_STATUS_START)
    }
}

bot.telegram.setWebhook('https://ramzyabbot.herokuapp.com/')
bot.startWebhook('', {}, process.env.PORT || 8000)
bot.launch();