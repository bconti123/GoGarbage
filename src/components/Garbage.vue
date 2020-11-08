<template>
<div>
  <div class="container mt-5">
    <header>
      <b-img src="../assets/ms-icon-310x310.png" style="max-width: 240px;max-height: 240px;"></b-img>
    <h1>Welcome to GoGarbage!</h1>
    <h3>Mission</h3>
    <p>We are here to help people who don't know of nearby locations to take care of their garbage, recyclables, metal, etc! 
    We don't want anyone to throw anything in the wrong bin or litter. We want to reduce pollution on the Earth. 
    Keeping the earth clean is very important for both humans and animals. Try finding nearby trash and recycle cans in
    a new way to improve the enivroment and our values.</p>
    
    </header>
    <section>
      <div id="AppMap">
        <AppMap></AppMap>
      </div>
    </section>
  </div>

</div>
</template>

<script>
import AppMap from './AppMap'

export default {
  name: 'Garbage',
  components: {
    AppMap
  },
  props: {
    msg: String
  }
}
</script>