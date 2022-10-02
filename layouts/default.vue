<template>
    <div>
        <TheHeader @sidenavToggle="displaySidenav=!displaySidenav" />
        <TheSideNav :show="displaySidenav" @close="displaySidenav=false" />
        <nuxt />
    </div>
</template>
<script>
export default {
    data() {
        return {
            displaySidenav: false
        }
    }
}
</script>
<style>
html {
    font-family: 'Open Sans', sans-serif;
}

body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
</style>