import { defineStore } from "pinia";
import { getUserInfo } from "@/api/user";
import{ ref } from "vue";
export const useUserStore = defineStore('user',() =>{ 
    const token = ref('')
    const setToken = (newToken) =>{
        token.value = newToken
    }
    const removeToken = () =>{
        token.value = ''
    }
    const user = ref({})
    const getUser = async() =>{
        const res = await getUserInfo()
        user.value = res.data.data
    }
    const setUser = (newUser) =>{
        user.value = newUser
    }
    return {
        token,
        setToken,
        removeToken,
        user,
        getUser,
        setUser
    }
},
{persist :true}
)