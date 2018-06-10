<template>
    <div class="fly-ball">
        <transition v-for="(ball, index) in balls" :key="index" name="ballslist" @appear="ballAppear" @after-appear="ballAfterAppear">
            <div v-if="ball.show" class="ball" :data-id="ball.id" :style="{transform: `translate3d(${ball.x}px, ${ball.y}px, 0)`}">
            </div>
        </transition>
        <div class="targetEle"></div>
    </div>
</template>

<script>
export default {
    props: {
        from: '',
        to: ''
    },
    data () {
        return {
            balls: [],
            speed: 7,   // 控制小球运动速度
            endTarget: { x: 0, y: 0 },
            startTarget: { x: 0, y: 0 },  // 购物车坐标
        }
    },
    mounted () {
        this.$nextTick(() => {
            /*   this.endTarget = {
                  x: this.to.getBoundingClientRect().left, y: this.to.getBoundingClientRect().top - 20
              }
              this.startTarget = {
                  x: this.from.getBoundingClientRect().left + 50, y: this.from.getBoundingClientRect().top - 20
              } */
        })
    },
    methods: {
        addBall () {
            let balls = this.balls;
            this.endTarget = {
                x: this.to.getBoundingClientRect().left, y: this.to.getBoundingClientRect().top - 20
            }
            this.startTarget = {
                x: this.from.getBoundingClientRect().left + 50, y: this.from.getBoundingClientRect().top - 20
            }
            balls.push({ id: new Date().getTime(), x: this.startTarget.x, y: this.startTarget.y, show: true })
        },
        ballMove (el, x, y, a, done) {
            let style = el.style, sx = x, sy = y;
            let moveFn = (x, y) => {
                requestAnimationFrame(() => {
                    let transform = `translate3d(${x}px, ${y}px, 0) scale(${1 - (y - this.startTarget.y) / (this.endTarget.y - this.startTarget.y) * .6})`;
                    style.transform = transform
                    style.wekitTransform = transform;
                    if (x < this.endTarget.x) {
                        y = a * Math.pow(x - sx, 2) + sy
                        x += this.speed
                        moveFn(x, y)
                    } else {
                        done()
                    }
                })
            }
            moveFn(x, y)
        },
        ballAppear (el, done) {
            let balls = this.balls
            let endTarget = this.endTarget
            let id = el.dataset.id
            let x, y
            for (let i = 0; i < balls.length; i++) {
                if (balls[i].id == id) {
                    x = balls[i].x
                    y = balls[i].y
                    break
                }
            }
            let a = (endTarget.y - y) / Math.pow(endTarget.x - x, 2)
            this.ballMove(el, x, y, a, done)
        },
        ballAfterAppear (el) {
            let balls = this.balls
            let id = el.dataset.id
            // 隐藏小球
            for (let i = 0; i < balls.length; i++) {
                if (balls[i].id == id) {
                    balls[i].show = false
                    break
                }
            }
        },
    }
}
</script>

<style lang="less">
@bg: #f11717;
@rem: 40rem;
.fly-ball {
    position: fixed;
    left: 0;
    bottom: 0;
    .ball {
        position: fixed;
        width: 40 / @rem;
        height: 40 / @rem;
        border-radius: 50%;
        background-color: @bg;
        z-index: 1999;
        left: 0;
        top: 0;
        opacity: 1;
        transform: scale(1);
        z-index: 100;
    }
    .targetEle {
        width: 40px;
        height: 40px;
        background-color: @bg;
        transform: translate(580px, 600px);
    }
}
</style>

