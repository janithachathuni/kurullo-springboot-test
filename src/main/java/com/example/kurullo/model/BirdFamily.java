package com.example.kurullo.model;

public enum BirdFamily {
    ACCIPITRIDAE("Birds of Prey"),
    AEGITHALIDAE("Long-tailed Tits"),
    ALAUDIDAE("Larks"),
    ALCEDINIDAE("Kingfishers"),
    ANATIDAE("Ducks, Geese & Swans"),
    APODIDAE("Swifts"),
    ARDEIDAE("Herons & Egrets"),
    BUCEROTIDAE("Hornbills"),
    CAMPEPHAGIDAE("Cuckoo-shrikes"),
    CAPRIMULGIDAE("Nightjars"),
    CHARADRIIDAE("Plovers"),
    CICONIIDAE("Storks"),
    CISTICOLIDAE("Cisticolas & Allies"),
    COLUMBIDAE("Pigeons & Doves"),
    CORACIIDAE("Rollers"),
    CORVIDAE("Crows, Jays & Magpies"),
    CUCULIDAE("Cuckoos"),
    DICAEIDAE("Flowerpeckers"),
    DICRURIDAE("Drongos"),
    ESTRILDIDAE("Estrildid Finches"),
    FALCONIDAE("Falcons & Caracaras"),
    FRINGILLIDAE("Finches & Canaries"),
    HIRUNDINIDAE("Swallows & Martins"),
    LANIIDAE("Shrikes"),
    LARIDAE("Gulls, Terns & Skimmers"),
    MEGALAIMIDAE("Asian Barbets"),
    MEROPIDAE("Bee-eaters"),
    MOTACILLIDAE("Wagtails & Pipits"),
    MUSCICAPIDAE("Old World Flycatchers"),
    NECTARINIIDAE("Sunbirds"),
    ORIOLIDAE("Orioles"),
    PELECANIDAE("Pelicans"),
    PHASIANIDAE("Pheasants & Allies"),
    PICIDAE("Woodpeckers"),
    PITTIDAE("Pittas"),
    PLOCEIDAE("Weavers"),
    PSITTACIDAE("Parrots"),
    PYCNONOTIDAE("Bulbuls"),
    RALLIDAE("Rails, Crakes & Coots"),
    SCOLOPACIDAE("Sandpipers & Allies"),
    STRIGIDAE("Owls"),
    STURNIDAE("Starlings"),
    SYLVIIDAE("Sylviid Warblers"),
    THRESKIORNITHIDAE("Ibises & Spoonbills"),
    TIMALIIDAE("Babblers"),
    TURDIDAE("Thrushes"),
    TYTONIDAE("Barn Owls"),
    UPUPIDAE("Hoopoes"),
    VANGIDAE("Vangas"),
    ZOSTEROPIDAE("White-eyes");

    private final String category;

    BirdFamily(String category) {
        this.category = category;
    }

    public String getCategory() {
        return category;
    }

    public String getDisplayName() {
        String name = name();
        return name.charAt(0) + name.substring(1).toLowerCase();
    }
}