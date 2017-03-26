var app = new Vue({
    el: '#app',
    data: {
        cards: [],
        timer: 0,
        totalSeconds: 0,
        currentTime: { hour: 0, minute: 0, seconds: 0 }
    },
    created: function () {
        this.cards = this.getCards();
    },
    computed: {
        isReachMaxFlippedCard: function () {
            var maxFlipped = 2;
            var totalFlipped = this.flippedCards.length;
            return totalFlipped >= maxFlipped;
        },

        flippedCards: function () {
            var cards = _.filter(this.cards, function (card) {
                return card.isFlipped === true;
            });

            return cards;
        },

        isGameCompleted: function () {
            var totalCompleted = _.filter(this.cards, function (card) {
                return card.isCompleted === true;
            }).length;

            var isCompleted = this.cards.length === totalCompleted;
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
        getCards: function () {
            var ids = ['a', 'b', 'c', 'd', 'e', 'f'];
            var cards = _.concat([], ids, ids);
            var imgBaseUrl = 'assets/images/starwars/%img.jpg';
            var list = _.map(cards, function (card, key) {
                return {
                    id: key,
                    coverImg: imgBaseUrl.replace('%img', 'cover'),
                    img: imgBaseUrl.replace('%img', 'card-' + card),
                    isCompleted: false,
                    isFlipped: false
                };
            })

            return _.shuffle(list);
        },
        flipCard: function (card) {
            if (this.isReachMaxFlippedCard) return;
            if (card.isCompleted) return;
            if (card.isFlipped) return;

            // once clicked, game started
            if (!this.timer) {
                this.startGame();
            }

            card.isFlipped = true;

            if (this.isReachMaxFlippedCard) {

                var cardNo1 = this.flippedCards[0].img;
                var cardNo2 = this.flippedCards[1].img;

                if (this.isMatch(cardNo1, cardNo2)) {
                    this.completeCards(this.flippedCards);

                    if (this.isGameCompleted) {
                        this.stopGame();
                    }
                }

                setTimeout(function () {
                    // reset all card to no flipped
                    this.cards.forEach(function (card) {
                        card.isFlipped = false;
                    })
                }.bind(this), 400);
            }
        },

        completeCards(cards) {
            cards.forEach(function (card) {
                card.isFlipped = false;
                card.isCompleted = true;
            });
        },

        reshuffle: function () {
            this.cards = this.getCards();
        },

        restartGame: function () {
            this.reshuffle();
            this.totalSeconds = 0;
            this.currentTime = { hour: 0, minute: 0, seconds: 0 };
            this.stopGame();
        },

        isMatch(no1, no2) {
            var isMatched = no1 === no2;

            return isMatched;
        },

        updateTime: function () {
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

            var hour = Math.floor(this.totalSeconds / secondsInHour);
            var minute = Math.floor(this.totalSeconds / secondsInMinute) - (hour * minutesInHour);
            var seconds = this.totalSeconds - (hour * secondsInHour + minute * secondsInMinute);

            this.currentTime = { hour: hour, minute: minute, seconds: seconds };
        },

        startGame() {
            this.totalSeconds = 0;
            this.timer = setInterval(this.updateTime, 1000);
        },

        stopGame() {
            this.timer = clearInterval(this.timer);
        }
    }
})