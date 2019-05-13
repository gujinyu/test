<template>
    <div id="tools">
        <p v-for="(item,index) in toolsItems" :key="index" @mouseover="item.iconTextShow = true" @mouseleave="item.iconTextShow = false" :id="item.idName" :class="item.iconDisabled?(item.iconChecked?'tips checked':'tips'):'disabled'" @click="iconClick(index)" :title="item.title">
            <i :class="item.iconName"></i>
            <span v-bind:style="{visibility:item.iconTextShow?'visible':'hidden'}">{{item.iconText}}</span>
        </p>
    </div>
</template>
<script>
export default {
    props: ['toolsItems'],
    methods: {
        iconClick(e) {
            if (this.toolsItems[e].iconDisabled) {
                this.toolsItems[e].iconChecked = !this.toolsItems[e].iconChecked;
                this.$emit("change", {
                    index: e,
                    checked: this.toolsItems[e].iconChecked,
                    disabled: this.toolsItems[e].iconDisabled,
                    callback: this.toolsItems[e].iconClick,
                    text: this.toolsItems[e].iconText
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
#tools {
    height: 38px;
    position: absolute;
    z-index: 10000000;
    top: 5px;
    right: 40px;
    display: flex;
    align-items: center;
    margin-top: 8px;
    background-color: rgb(240, 232, 229);
    border-radius: 5px;
    box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.6);
    p {
        height: 38px;
        cursor: pointer;
        display: flex;
        // margin-right: 10px;
        flex-direction: column;
        width: 44px;
        border-right: 1px solid #c0c0c0;
        i {
            font-size: 24px;
            line-height: 38px;
        }
        span {
            position: absolute;
            color: #409eff;
            font-size: 12px;
            text-align: center;
            bottom: -22px;
            width: 44px;
            white-space: nowrap;
        }
    }
    p:nth-child(1) {
        border-bottom-left-radius: 5px;
        border-top-left-radius: 5px;
    }
    p:nth-last-child(1) {
        border-right: none;
        border-bottom-right-radius: 5px;
        border-top-right-radius: 5px;
    }
    #icon5 {
        span {
            margin-left: -18px;
        }
    }
    #icon6 {
        span {
            margin-left: -18px;
        }
    }
    .tips:hover {
        color: #409eff;
    }
    .checked {
        // background-color: rgb(240, 232, 229);
        background-color: #fff;
        color: #409eff;
    }
    .disabled {
        cursor: not-allowed;
    }
}
</style>

