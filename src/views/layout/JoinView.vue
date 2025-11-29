<script setup>

</script>


<template>
    <div class="d">
        <div class="tit"> <h1> JOIN</h1> </div>
        <div class="main">        <P>The goal is to establish an excellent game production team, become an excellent game producer, and create a virtual world that people love.
            The team currently has only one person and knows nothing. 
            Everyone who is interested is welcome to join!</P> </div>
        <div class="mate">
            <div class="icon qq">
                <ul>
                    <li>
                        123456
                    </li>
                </ul>
            </div>
             <div class="icon vx">
                <ul>
                    <li>
                        123456
                    </li>
                </ul>
            </div>
            <a href="https://space.bilibili.com/397216357?spm_id_from=333.6.0.0" target="top">
                <div class="icon bilibili">
                    <ul>
                        <li>link to my bilibili</li>
                    </ul>
                </div>
            </a>
            <a href="https://github.com/dashboard" target="top">
                <div class="icon github">
                    <ul>
                        <li>link to my GitHub</li>
                    </ul>
                </div>
            </a>                          
        </div>
    </div>
</template>


<style scoped lang="scss">
.d{
            width: 80%;
            height: 80vh;
            display: flex;
            flex-direction: column; /* 让子元素垂直排列 */
            position: relative;
            top: 1vh;
            left: 10%;
            background: url(@/assets/Clannad.png) no-repeat ;
            background-size: cover;
            box-shadow: 5px 5px 5px 5px rgba(0,0,0,0.5);
            opacity: 0.9;
            .tit{
            color: rgb(183, 207, 226);
            margin:50px auto;
            font-size: 2em;
        }
         .main{
            width: 60%;
            height: 20%;
            color: rgb(183, 207, 226);
            margin:50px auto;
        }
        .mate{
            width: 60%;
            height: 10%;
            display: flex;
            margin: 0 auto;
        }
        }
    
       
        
        .mate .icon{
            height: 30px;
            width: 30px;
            margin-right: 55px;
            background-size: cover;
            transition: 0.4s ease 0s;
            
        }
        .mate .icon:hover{
            transform: scale(1.2);
            cursor: pointer;
        }
        .icon ul{
            list-style: none;
            display: none;            /* 默认不显示 */
            margin-top: 35px;
        }
        .mate .icon.qq{
        background: url("@/assets/qq.png") no-repeat;
        background-size: 25px;
        }
        .mate .icon.vx{
        background: url("@/assets/vx.png") no-repeat;
        background-size: 25px;
        }
        .mate .icon.bilibili{
        background: url("@/assets/bilibili.png") no-repeat;
        background-size: 25px;
        background-color: rgb(245, 128, 147);
        border-radius: 5px;
        }
        .mate .icon.github{
        background: url("@/assets/github.png") no-repeat;
        background-size: 35px;
        }
        .icon:hover ul{
        display: block;            /* 鼠标移入时显示 */
        position: absolute;
        }
</style>