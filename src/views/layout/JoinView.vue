<script setup>
</script>

<template>
    <div class="d">
        <div class="content">
            <div class="tit"> <h1>JOIN</h1> </div>
            <div class="main">
                <p>The goal is to establish an excellent game production team, become an excellent game producer, and create a virtual world that people love.</p>
                <p>The team currently has only one person and knows nothing. Everyone who is interested is welcome to join!</p>
            </div>
            <div class="mate">
                <div class="icon qq">
                    <ul>
                        <li>123456</li>
                    </ul>
                </div>
                <div class="icon vx">
                    <ul>
                        <li>123456</li>
                    </ul>
                </div>
                <a href="https://space.bilibili.com/397216357?spm_id_from=333.6.0.0" target="_blank">
                    <div class="icon bilibili">
                        <ul>
                            <li>Bilibili</li>
                        </ul>
                    </div>
                </a>
                <a href="https://github.com/dashboard" target="_blank">
                    <div class="icon github">
                        <ul>
                            <li>GitHub</li>
                        </ul>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.d {
    width: 80%;
    height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    top: 1vh;
    left: 10%;
    background: url('@/assets/Clannad.webp') no-repeat center;
    background-size: cover;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    opacity: 0.9;
    border-radius: 16px;
    overflow: hidden;

    .content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 2rem 0;

        .tit {
            color: rgb(183, 207, 226);
            font-size: 2.5em;
            margin-bottom: 1.5rem;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .main {
            width: 85%;
            text-align: center;
            color: rgb(210, 225, 240);
            line-height: 1.6;
            font-size: 1.1em;
            margin-bottom: 2rem;
            max-width: 600px;

            p {
                margin: 0.8rem 0;
            }
        }

        .mate {
            width: 85%;
            height: 10%;
            display: flex;
            justify-content: center;
            gap: 1.8rem;
            margin-top: 1rem;
        }
    }
}

.mate .icon {
    height: 40px;
    width: 40px;
    background-size: 70%;
    transition: all 0.3s ease;
    cursor: pointer;

    border-radius: 50%;


    &:hover {
        transform: scale(1.2) translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    }

    ul {
        list-style: none;
        display: none;
        position: absolute;




        color: white;
        z-index: 10;
    }
}

.mate .icon.qq {
    background: url('@/assets/qq.webp') no-repeat center;
    background-size: 70%;
}

.mate .icon.vx {
    background: url('@/assets/vx.webp') no-repeat center;
    background-size: 70%;
}

.mate .icon.bilibili {
    background: url('@/assets/bilibili.webp') no-repeat center;
    background-size: 70%;


}

.mate .icon.github {
    background: url('@/assets/github.webp') no-repeat center;
    background-size: 100%;

}
</style>