<template>
    <section class="container">
        <div id="map"></div>
    </section>

</template>

<script>
    import L from 'leaflet'
    import "leaflet/dist/leaflet.css"
    import "leaflet.vectorgrid"

    export default {
        name: 'Map',
        components:{},
        data () {
            return {
                clickedTileId: null,
            }
        },
        mounted () {
            this.drawMap()
            this.renderShape()
        },
        computed: {
            sharedState () {
                return this.$store.state
            },
        },
        methods: {
            drawMap () {
                const osmtile = L.tileLayer('//{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    zIndex: 1,
                    attribution: '&copy; <a href="//osm.org/copyright">OpenStreetMap</a> contributors'
                })
                const gsistdtile = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
                    zIndex: 1,
                    attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
                })
                const map = L.map('map', { 
                    center: [34.54, 133.745],
                    zoom: 11,
                    layers: [osmtile],
                    zoomControl: false,
                    minZoom: 6,
                    maxZoom: 17,
                    gestureHandling: true,
                    preferCanvas: true,
                    scrollWheelZoom: false
                })
                L.control.zoom({ position: 'bottomright' }).addTo(map)
                const mapObj = document.getElementById('map')
                mapObj.addEventListener("focus", () => {map.scrollWheelZoom.enable()});
                mapObj.addEventListener("blur", () => {map.scrollWheelZoom.disable()});

                L.control.scale({imperial:false}).addTo(map)

                L.control.layers({
                  "OpenStreetMap": osmtile,
                  "国土地理院 - 標準地図": gsistdtile,
                }).addTo(map)
                this.$store.commit('setMap', map)
            },
            renderShape () {
                const vectorLayer = L.vectorGrid.protobuf("http://localhost:2611/data/kurashiki/{z}/{x}/{y}.pbf", {
                    rendererFactory: L.canvas.tile,
                    getFeatureId: function(f){

                        return String(f.properties["KEY_CODE"])
                        // console.log(f) //eslint-disable-line
                    },
                    interactive: true,
                    vectorTileLayerStyles:{
                        "kurashiki":this.sharedState.initialTileStyle
                    },

                });
                this.$store.commit('setVectorTileInstance',vectorLayer)
                vectorLayer.on("click", (e)=>{
                    this.clickedTileId = e.layer.properties["KEY_CODE"];
                    // console.log(this.clickedTileId) //eslint-disable-line
                    vectorLayer.bindPopup(this.clickedTileId)
                });
                    
                
                this.$store.commit('addLayer', vectorLayer)  

            },
            setFeatureStyleAsync(newval,oldval){
                if(oldval){
                    this.sharedState.vectorTileInstance.setFeatureStyle(oldval,this.sharedState.initialTileStyle)
                }
                this.sharedState.vectorTileInstance.setFeatureStyle(newval,{
                    fill:true,
                    fillColor: "red",
                    color: "green"
                })
            },

        },
        watch: {
            clickedTileId: function(newval,oldval){
                this.setFeatureStyleAsync(newval,oldval)
            }
        }
    }
</script>

<style scoped>

#map {
  height: 500px;
  width: 800px;
  margin: auto;
}

</style>
