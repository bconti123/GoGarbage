<template>
  
  <div id="app">
    <div>
      <b-navbar toggleable="lg" type="dark" class="mynav">
        <b-navbar-brand to="/">
        <img src="./assets/favicon-32x32.png" class="d-inline-block align-top" alt="Kitten">
        GoGarbage
        </b-navbar-brand>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item exact to="/">Home</b-nav-item>
            <b-nav-item exact to="/trash">Trash</b-nav-item>
            <b-nav-item exact to="/create">Record</b-nav-item>
          </b-navbar-nav>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-form>
              <b-form-input size="sm" class="mr-sm-2" placeholder="Location"></b-form-input>
              <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
            </b-nav-form>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>

    <router-view></router-view>
   <footer class="py-3 text-center mt-5 myfoot">
     &copy; GoGarbage 2020 - HackRPI Hackathon Project
  </footer>
  </div>
  
</template>

<script>
export default {
  name: 'App'
}

</script>

<style>
  @import './assets/styles.css';
  .mynav {
    background-color: #5a9216;
  }
  .myfoot {
    background-color: #bef67a;
  }
</style>
