plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "vn.androidhaui.travelapp"
    compileSdk = 36

    defaultConfig {
        applicationId = "vn.androidhaui.travelapp"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"
        multiDexEnabled = true

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildFeatures {
        viewBinding = true
        dataBinding = true
    }

    signingConfigs {
        create("release") {
            storeFile = file("D:\\TravelApp\\myapp-release-key.jks")
            storePassword = "foxtrip2025"
            keyAlias = "mykey"
            keyPassword = "foxtrip2025"
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("release")
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}

dependencies {
    implementation(libs.androidx.viewpager2)
    implementation(libs.mpandroidchart)
    implementation(libs.retrofit)
    implementation(libs.swiperefreshlayout)
    implementation(libs.retrofit.converter.gson)
    implementation(libs.lifecycle.viewmodel)
    implementation(libs.lifecycle.livedata)
    implementation(libs.lifecycle.runtime)
    implementation(libs.appcompat)
    implementation(libs.androidx.core.ktx)
    implementation(libs.okhttp)
    implementation(libs.okhttp.urlconnection)
    implementation(libs.gson)
    implementation(libs.recyclerview)
    implementation(libs.material)
    implementation(libs.activity)
    implementation(libs.constraintlayout)
    implementation(libs.glide)
    implementation(libs.media3.exoplayer)
    implementation(libs.media3.ui)
    implementation(libs.youtube.player)
    annotationProcessor(libs.glide.compiler)
    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)
}