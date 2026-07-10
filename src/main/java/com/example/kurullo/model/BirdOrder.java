package com.example.kurullo.model;

public enum BirdOrder {
    ACCIPITRIFORMES,
    ANSERIFORMES,
    APODIFORMES,
    BUCEROTIFORMES,
    CAPRIMULGIFORMES,
    CHARADRIIFORMES,
    CICONIIFORMES,
    COLUMBIFORMES,
    CORACIIFORMES,
    CUCULIFORMES,
    FALCONIFORMES,
    GALLIFORMES,
    PELECANIFORMES,
    PICIFORMES,
    PSITTACIFORMES,
    STRIGIFORMES,
    UPUPIFORMES,
    PASSERIFORMES;

    public String getDisplayName() {
        String name = name();
        return name.charAt(0) + name.substring(1).toLowerCase();
    }
}