<template>
    <div>
        <GmapMap ref="map" class="map" :center="currentLocation" :zoom="8" map-type-id="terrain">
            <GmapMarker
                :position="currentLocation"
                :clickable="false"
                :draggable="false"/>
            <GmapMarker
                :key="index"
                v-for="(m, index) in markers"
                :position="m.position"
                :clickable="true"
                :draggable="false"
                :icon="getIcon(m.type)"
                @click="panToPos(m.position);showInfoWindow(m)"/>
            <GmapInfoWindow :opened="infoStatus.isOpen" :position="infoStatus.position" @closeclick="infoStatus.isOpen=false" :options="{pixelOffset:{width:0,height:-35}}">
                <div class="d-flex flex-column justify-content-center align-content-start">
                    <h6>{{ infoStatus.title }}</h6>
                    <div>Type: {{ infoStatus.text }}</div>
                    <b-badge pill :variant="tags[tag]" v-for="(tag, i) in infoStatus.tags" :key="i">{{ tag }}</b-badge>
                    <b-link :href="getDirection(infoStatus.position)" target="_blank">get direction</b-link>
                </div>
            </GmapInfoWindow>
        </GmapMap>
        <div class="mt-3 d-flex flex-column">
            <b-form inline class="d-flex justify-content-center">
                Locate Nearest 
                <b-form-select class="mx-2" v-model="selectedType" inline :options="['bin', 'site']"></b-form-select>
                with 
                <b-form-select class="mx-2" v-model="selectedTag" inline :options="getTagsOptions"></b-form-select>
                <b-button variant="primary" @click="queryNearby">locate</b-button>
            </b-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectedType: 'bin',
            selectedTag: 'any',
            currentLocation: {lat:10, lng:10},
            center: {lat:10, lng:10},
            markers: [
                {
                    name: 'Site 1',
                    type: 'bin',
                    tags: ['compost', 'general'],
                    position: {lat:42.6, lng:-73.7},
                },
                {
                    name: 'Site 2',
                    type: 'site',
                    tags: ['metal', 'plastic'],
                    position: {lat:42.6, lng:-73.2},
                },
                {
                    name: 'Site 3',
                    type: 'bin',
                    tags: ['compost', 'general', 'paper'],
                    position: {lat:42.1, lng:-73.7},
                },
                {
                    name: 'Site 4',
                    type: 'site',
                    tags: ['plastic'],
                    position: {lat:42.5, lng:-74},
                },
                {
                    name: 'Site 5',
                    type: 'bin',
                    tags: ['general'],
                    position: {lat:41.6, lng:-71.7},
                },
                {
                    name: 'Site 6',
                    type: 'site',
                    tags: ['compost', 'general'],
                    position: {lat:41.3, lng:-74.7},
                }
            ],
            tags: {
                general: 'primary',
                plastic: 'secondary',
                compost: 'success',
                metal: 'danger',
                paper: 'warning'
            },
            infoStatus: {
                isOpen: false,
                position: {lat: 10, lng: 10},
                title: 'TITLE',
                text: 'hello',
                tags: []
            }
        }
    },
    computed: {
        getTagsOptions() {
            return [
                'any',
                ...Object.keys(this.tags)
            ]
        },
        filteredMarkers() {
            if (this.selectedTag === 'any') {
                return this.markers;
            } else {
                return this.markers.filter(m => m.tags.includes(this.selectedTag));
            }
        },
        getNearbyBin() {
            let shortestD;
            let shortestM;
            for (let m of this.filteredMarkers) {
                if (m.type == 'bin') {
                    let d = Math.sqrt(Math.pow(this.currentLocation.lat - m.position.lat, 2) + Math.pow(this.currentLocation.lng - m.position.lng, 2))
                    if (!shortestD || d < shortestD) {
                        shortestD = d;
                        shortestM = m;
                    }
                }
            }
            return shortestM;
        },
        getNearbySite() {
            let shortestD;
            let shortestM;
            for (let m of this.filteredMarkers) {
                if (m.type == 'site') {
                    let d = Math.sqrt(Math.pow(this.currentLocation.lat - m.position.lat, 2) + Math.pow(this.currentLocation.lng - m.position.lng, 2))
                    if (!shortestD || d < shortestD) {
                        shortestD = d;
                        shortestM = m;
                    }
                }
            }
            return shortestM;
        }
    },
    methods: {
        cleandata(data) {
            for (let m of data) {
                m.position.lat = parseFloat(m.position.lat);
                m.position.lng = parseFloat(m.position.lng);
            }
            return data;
        },
        async getData() {
            const res = await this.axios.get('https://go-garbage.xyz/api', null);
            console.log(res.data);
            return res.data;
        },
        queryNearby() {
            if (this.selectedType == 'bin') {
                this.queryNearbyBin();
            } else if (this.selectedType == 'site') {
                this.queryNearbySite();
            }
        },
        queryNearbyBin() {
            let nearby = this.getNearbyBin;
            if (!nearby) {
                this.$bvToast.toast('Could not find a trash/bin site with ' + this.selectedTag + ' nearby 😢', {
                    title: 'Warning',
                    variant: 'warning',
                    solid: true
                })
            }
            this.panToPos(nearby.position);
            this.showInfoWindow(nearby);
        },
        queryNearbySite() {
            let nearby = this.getNearbySite;
            if (!nearby) {
                this.$bvToast.toast('Could not find a trash/bin site with ' + this.selectedTag + ' nearby 😢', {
                    title: 'Warning',
                    variant: 'warning',
                    solid: true
                })
            }
            this.panToPos(nearby.position);
            this.showInfoWindow(nearby);
        },
        getDirection(position) {
            return 'https://www.google.com/maps/search/?api=1&query=' + position.lat + ',' + position.lng;
        },
        geolocation() {            
            navigator.geolocation.getCurrentPosition((position) => {
                this.currentLocation =  {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
            });
        },
        showInfoWindow(marker) {
            this.infoStatus.position = marker.position;
            this.infoStatus.title = marker.name;
            this.infoStatus.text = marker.type;
            this.infoStatus.tags = marker.tags;
            this.infoStatus.isOpen = true;
        },
        async panToPos(position) {
            const mapref = await this.$refs.map.$mapPromise;
            mapref.panTo(position);
        },
        getIcon(type) {
            if (type === 'bin') {
                return 'http://www.myiconfinder.com/uploads/iconsets/32-32-6148db914e2614b0fba3d2bd94211f61.png';
            } else if (type == 'site') {
                return 'http://www.myiconfinder.com/uploads/iconsets/32-32-7bf4e17feae2a7fe1538d4ff9d56f666.png';
            }
            return ''
        }
    },
    async mounted() {
        this.geolocation();
        let rawData = await this.getData();
        this.markers = this.cleandata(rawData);
    }
}
</script>

<style scoped>
.map {
    widows: 100%;
    height: 500px;
}
</style>