<template>
  <CDialog v-bind="$attrs" v-on="$listeners">
    <div class="content">
      <div class="title">{{ $t('home.selectItem.title') }}</div>
      <CDivider />
      <div class="scroll">
        <div v-for="item in items" :key="item.TokenId" class="chain" @click="select(item)">
          <span class="chain-left">
            <img :src="item.url ? item.url : unknown" />
            <span>{{ item.AssetName }} {{ item.TokenId }}</span>
          </span>
          <img v-if="itemId === item.TokenId" src="@/assets/svg/check.svg" />
        </div>
      </div>
    </div>
  </CDialog>
</template>

<script>
export default {
  name: 'SelectAsset',
  inheritAttrs: false,
  props: {
    itemId: String,
    items: Array,
  },
  data() {
    return {
      unknown: require('@/assets/svg/unknown.svg'),
    };
  },
  methods: {
    select(item) {
      this.$emit('update:visible', false);
      this.$emit('update:item', item);
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 100vh;
  background: #171f31;
  box-shadow: 0px 2px 18px 7px rgba(#000000, 0.1);
}

.title {
  padding: 80px 50px 20px;
  font-weight: 500;
}

.scroll {
  flex: 1;
  padding: 16px 10px;
  overflow-y: auto;
  @include scroll-bar(rgba(#fff, 0.2), transparent);
}

.chain {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 40px;
  transition: all 0.3s;
  @include child-margin-h(16px);

  &:hover {
    opacity: 0.8;
    background: rgba(#000000, 0.3);
  }
}

.chain-left {
  display: flex;
  align-items: center;
  @include child-margin-h(8px);
}

.chain-icon {
  width: 24px;
}
</style>
