import java.util.Properties
import javax.inject.Inject

plugins {
    id("com.android.application")
}

/*
 * Веб-приложение из папки ../web копируется в assets/www при каждой сборке,
 * поэтому APK/AAB всегда содержит актуальную версию интерфейса.
 */
abstract class CopyWebAssets : DefaultTask() {
    @get:InputDirectory
    abstract val webDir: DirectoryProperty

    @get:OutputDirectory
    abstract val outputDir: DirectoryProperty

    @get:Input
    abstract val excludes: ListProperty<String>

    @get:Inject
    abstract val fs: FileSystemOperations

    @TaskAction
    fun run() {
        val skip = excludes.get()
        fs.sync {
            from(webDir)
            into(outputDir.dir("www"))
            exclude(skip)
        }
    }
}

val copyWebAssets = tasks.register<CopyWebAssets>("copyWebAssets") {
    webDir.set(rootProject.layout.projectDirectory.dir("../web"))
    // В APK не нужны: офлайн-помощник сайта и картинки для магазинов/превью ссылок
    excludes.set(listOf("sw.js", "**/.DS_Store", "icons/*.png"))
}

/*
 * Подпись релиза. Ключ НЕ хранится в репозитории.
 * Вариант 1: файл android/keystore.properties (storeFile, storePassword, keyAlias, keyPassword).
 * Вариант 2: переменные окружения SF_KEYSTORE, SF_KEYSTORE_PASSWORD, SF_KEY_ALIAS, SF_KEY_PASSWORD (для CI).
 */
val signing = Properties().apply {
    val f = rootProject.file("keystore.properties")
    if (f.exists()) f.inputStream().use { load(it) }
    System.getenv("SF_KEYSTORE")?.let { setProperty("storeFile", it) }
    System.getenv("SF_KEYSTORE_PASSWORD")?.let { setProperty("storePassword", it) }
    System.getenv("SF_KEY_ALIAS")?.let { setProperty("keyAlias", it) }
    System.getenv("SF_KEY_PASSWORD")?.let { setProperty("keyPassword", it) }
}
val hasSigning = listOf("storeFile", "storePassword", "keyAlias", "keyPassword").all { !signing.getProperty(it).isNullOrBlank() }

android {
    namespace = "io.shiftflow.app"
    compileSdk = 36

    defaultConfig {
        applicationId = "io.shiftflow.app"
        minSdk = 24
        targetSdk = 36
        versionCode = 300
        versionName = "3.0.0"
    }

    signingConfigs {
        // Общий отладочный ключ из репозитория (пароль android): тестовые APK, собранные где угодно,
        // подписаны одинаково и обновляются поверх друг друга без потери данных.
        getByName("debug") {
            storeFile = file("debug.keystore")
            storePassword = "android"
            keyAlias = "androiddebugkey"
            keyPassword = "android"
        }
        if (hasSigning) {
            create("release") {
                storeFile = rootProject.file(signing.getProperty("storeFile"))
                storePassword = signing.getProperty("storePassword")
                keyAlias = signing.getProperty("keyAlias")
                keyPassword = signing.getProperty("keyPassword")
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            if (hasSigning) signingConfig = signingConfigs.getByName("release")
        }
        debug {
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    buildFeatures {
        buildConfig = true
    }

    lint {
        abortOnError = true
        checkReleaseBuilds = true
    }
}

androidComponents {
    onVariants(selector().all()) { variant ->
        variant.sources.assets?.addGeneratedSourceDirectory(copyWebAssets, CopyWebAssets::outputDir)
    }
}
