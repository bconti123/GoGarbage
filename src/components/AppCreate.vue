<template>
    <div class="container mt-5">
        <b-row>
            <b-col>
                <h1>Record New Trash Site</h1>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-card class="bg-light" @submit="submitForm">
                    <b-form>
                        <!-- Name -->
                        <b-form-group label="Name of Site">
                            <b-form-input required v-model="form.name" placeholder="Site 1"></b-form-input>
                        </b-form-group>
                        <!-- Type -->
                        <b-form-group label="Type">
                            <b-form-select required v-model="form.type" :options=typeOptions></b-form-select>
                        </b-form-group>
                        <!-- Category -->
                        <b-form-group label="Category">
                            <b-form-tags required v-model="form.tags" placeholder="add tags (etc: general, plastic, compost)"></b-form-tags>
                        </b-form-group>
                        <!-- Location -->
                        <b-form-group label="Locations">
                            <b-input-group prepend="Coordinate">
                                <b-form-input required type="number" step="any" v-model="form.position.lat" placeholder="latitude"></b-form-input>
                                <b-form-input required type="number" step="any" v-model="form.position.lng" placeholder="longitude"></b-form-input>
                                <b-input-group-append>
                                    <b-button @click="geolocation">locate here</b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </b-form-group>
                        <GmapMap ref="map2" class="map" :center="currentLocation" :zoom="8" map-type-id="terrain" @click="getLocation">
                            <GmapMarker
                                :position="currentLocation"
                                :clickable="false"
                                :draggable="false"/>
                        </GmapMap>
                        <!-- submit -->
                        <b-button type="submit" variant="primary">Submit</b-button>
                    </b-form>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>

<script>
export default {
    name: 'Create',
    data() {
        return {
            currentLocation: {lat:10, lng:10},
            form: {
                name: '',
                type: 'bin',
                tags: ['general'],
                position: {
                    lat: null,
                    lng: null
                }
            },
            typeOptions: ['bin', 'site'],
        }
    },
    methods: {
        async getLocation(evt) {
            const pos = JSON.parse(JSON.stringify(evt.latLng.toJSON(), null, 2));
            const mapref = await this.$refs.map2.$mapPromise;
            mapref.panTo(pos);
            this.form.position = pos;
        },
        async pushData() {
            // const res = await this.axios.post("http://35.223.210.29:4000/data", {
            //     name: this.form.name,
            //     type: this.form.type,
            //     tags: this.form.tags,
            //     position: this.form.position
            // }).then(function(response){
            //     console.log(response);
            //     console.log(res);
            // });
            const res = await this.axios.post("https://go-garbage.xyz/api", {
                name: this.form.name,
                type: this.form.type,
                tags: this.form.tags,
                position: this.form.position  
            });
            //res.header("Access-Control-Allow-Origin", "*");
            console.log(res);
        },
        async submitForm(evt) {
            evt.preventDefault();
            try {
                await this.pushData();
                this.$bvToast.toast('Thank you for your input 😊', {
                    title: 'Success',
                    variant: 'success',
                    solid: true
                });
                this.form = {
                    name: '',
                    type: 'bin',
                    tags: ['general'],
                    position: {
                        lat: null,
                        lng: null
                    }
                }
            } catch (e) {
                console.log(e);
            }
        },
        geolocation() {            
            navigator.geolocation.getCurrentPosition((position) => {
                this.form.position =  {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
            });
        },
        geolocationCurrent() {            
            navigator.geolocation.getCurrentPosition((position) => {
                this.currentLocation =  {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
            });
        },
    },
    async mounted() {
        this.geolocation();
        this.geolocationCurrent();
    }
}
</script>

<style scoped>
.map {
    widows: 100%;
    height: 500px;
}
</style>