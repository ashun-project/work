<template>
    <div class="bannere-lee">
        <Carousel loop autoplay v-model="card" radius-dot>
            <CarouselItem v-for="(itm , idx) in list" :key='idx' @click="goPage(itm.targetUrl)">
                <div @click="goPage(itm.targetUrl)" class="img-wrap">
                    <img :v-lazy="itm.netUrl" @click="goPage(itm.targetUrl)">
                </div>
            </CarouselItem>
        </Carousel>
    </div>
</template>

<script>
export default {
    data () {
        return {
            card: 0,
            list: []
        };
    },
    methods: {
        goPage (url) {
            // console.log(url)
            if (url) {
                if (url.indexOf("http") !== -1) {
                    window.open(url);
                } else {
                    this.$router.push(url);
                }
            }
        }
    },
    created () {
        this.$http
            .post("/api/v2/cms/queryBanners", { frontType: "pc" })
            .then(response => {
                if (response.data.code !== 0) return;
                this.list = response.data.data;
                // console.log(this.list);
            });
    }
};
</script>

<style lang="less">
.bannere-lee {
    height: 310px;
    div {
        height: 310px;
    }
    .ivu-carousel-dots li button.radius {
        height: 8px;
        width: 8px;
    }

    .ivu-carousel-dots-inside {
        bottom: 10px;
    }
    .ivu-carousel-dots li button {
        background-color: white;
    }
}
.ivu-carousel-dots li button {
    opacity: 0.45;
}
</style>
<style scoped>
</style>
