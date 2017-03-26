// http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
var imgBase = 'assets/starwars/%img.jpg';

var shuffle = function (a, b) {
    return a.length == 0 ? b : function (c) {
        return shuffle(a, (b || []).concat(c));
    }(a.splice(Math.floor(Math.random() * a.length), 1));
}

var getCards = function () {
    var ids = ['a', 'b', 'c', 'd', 'e', 'f'];
    var cards = _.concat([], ids, ids);
    var list = _.map(cards, function(card, key) {
        return { id: key, img: imgBase.replace('%img', 'card-' + card) }
    })

    return _.shuffle(list);
};

var app = new Vue({
    el: '#app',
    data: {
        imgCover: imgBase.replace('%img', 'cover'),
        cards: getCards(),
        flippedCards: [],
        completedCards: [],
        timerId: 0,
        totalSeconds: 0,
        currentTime: { hour: 0, minute: 0, seconds: 0 }
    },
    computed: {
        isReachMaxFlippedCard: function () {
            return this.flippedCards.length >= 2;
        },

        isGameCompleted: function () {
            var isCompleted = this.cards.length === this.completedCards.length;
            if (isCompleted) this.stopGame();
            return isCompleted;
        }
    },
    filters: {
        lpadTime: function (value) {
            var format = '00';
            var text = format + value;
            return text.slice(-format.length)
        }
    },
    methods: {
        flipCard: function (card) {
            if (this.isReachMaxFlippedCard) return;

            // once clicked, game started
            if (!this.timerId) {
                this.startGame();
            }

            this.flippedCards = this.flippedCards.concat({ id: card.id, img: card.img });

            if (this.isReachMaxFlippedCard) {

                var cardNo1 = this.flippedCards[0].img;
                var cardNo2 = this.flippedCards[1].img;

                if (this.isMatch(cardNo1, cardNo2)) {
                    this.completeCards(this.flippedCards);
                }

                setTimeout(function () {
                    this.flippedCards = [];
                }.bind(this), 400);
            }
        },

        isFlippedCard: function (id) {
            var findId = function (card) {
                return id === card.id;
            }
            return this.flippedCards.findIndex(findId) > -1;
        },

        completeCards(cards) {
            var items = [].concat(cards);
            this.completedCards = this.completedCards.concat(items);
        },

        isCompletedCard: function (id) {
            var findId = function (card) {
                return id === card.id;
            }
            return this.completedCards.findIndex(findId) > -1;
        },

        reshuffle: function () {
            this.cards = getCards();
        },

        restartGame: function () {
            this.reshuffle();
            this.flippedCards = [];
            this.completedCards = [];
            this.totalSeconds = 0;
            this.currentTime = { hour: 0, minute: 0, seconds: 0 };
            this.stopGame();
        },

        isMatch(no1, no2) {
            var isMatched = no1 === no2;

            return isMatched;
        },

        timer: function timer() {
            ++this.totalSeconds;

            var oneSecond = 1;
            var secondsInMinute = oneSecond * 60;
            var secondsInHour = 60 * secondsInMinute;

            var minutesInHour = 60;

            // 3800 seconds equal to how many hour: minute: seconds?

            // hour = 3800 / (60 minutes * 60 seconds)
            //      = 3800 / secondsInHour , u need to round down, so
            //      = round down(3800 / secondsInHour)
            //      = so it's 1 hour

            // minute = round down(3800 / 60 seconds) - (hour * 60 minutes)
            //        = round down(3800 / secondsInMinute) - (hour * minutesInHour)
            //        = so it's 3 minutes

            // second = 3800 - total hours - total minutes
            //        = 3800 - (hour * 60 minutes * 60 seconds) - (minute * 60 seconds)
            //        = 3800 - (hour * secondsInHour) - (minute * secondsInMinute)
            //        = 20 minutes
            

            // var hour = Math.floor(this.totalSeconds / 3600);
            // var minute = Math.floor((this.totalSeconds - hour * 3600) / 60);
            // var seconds = this.totalSeconds - (hour * 3600 + minute * 60);

            var hour = Math.floor(this.totalSeconds / secondsInHour);
            var minute = Math.floor(this.totalSeconds / secondsInMinute) - (hour * minutesInHour);
            var seconds = this.totalSeconds - (hour * oneHour + minute * oneMinute);

            this.currentTime = { hour: hour, minute: minute, seconds: seconds };
        },

        startGame() {
            this.totalSeconds = 0;
            this.timerId = setInterval(this.timer, 1000);
        },

        stopGame() {
            this.timerId = clearInterval(this.timerId);
        }
    }
})