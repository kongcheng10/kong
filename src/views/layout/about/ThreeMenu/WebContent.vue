<template>
  <div class="about-site">
    <!-- 技术栈部分 -->
    <section class="tech-section">
      <h2>本網站所使用的技术</h2>
      <el-row :gutter="20">
        <el-col
          v-for="tech in techStack"
          :key="tech.name"
          :xs="24"
          :sm="12"
          :md="8"
        >
          <el-card shadow="hover" class="tech-card">
            <div class="tech-content">
              <span class="tech-icon">{{ tech.icon }}</span>
              <div>
                <h3>{{ tech.name }}</h3>
                <p>{{ tech.desc }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- 用户建议区 -->
    <section class="suggestion-section">
      <h2>留下你的建议 💬</h2>

      <!-- 主题筛选按钮 -->
      <div class="topic-filter">
        <el-button size="small" @click="currentTopic = null">全部</el-button>
        <el-button
          v-for="t in topics"
          :key="t.value"
          size="small"
          :type="currentTopic === t.value ? 'primary' : ''"
          @click="currentTopic = t.value"
        >
          {{ t.label }}
        </el-button>
      </div>

      <!-- 提交表单 -->
      <el-card shadow="never" class="form-card">
        <el-form @submit.prevent="addSuggestion">
          <el-form-item label="主题">
            <el-select v-model="newTopic" placeholder="请选择主题" style="width: 100%">
              <el-option
                v-for="t in topics"
                :key="t.value"
                :label="t.label"
                :value="t.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="内容">
            <el-input
              v-model="newContent"
              type="textarea"
              :rows="3"
              placeholder="写下你的宝贵建议（最多300字）"
              maxlength="300"
              show-word-limit
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              native-type="submit"
              :disabled="!newContent.trim()"
            >
              提交建议
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 建议列表（只读模式） -->
      <div v-if="filteredSuggestions.length > 0" class="suggestions-list">
        <el-card
          v-for="sug in filteredSuggestions"
          :key="sug.id"
          shadow="hover"
          class="suggestion-card"
        >
          <el-tag size="small" :type="getTagType(sug.topic)" style="margin-bottom: 8px;">
            {{ getTopicLabel(sug.topic) }}
          </el-tag>
          <p>{{ sug.content }}</p>
          <small class="text-muted">提交于 {{ formatDate(sug.createdAt) }}</small>
          <div class="card-actions">
            <el-button size="small" type="primary" plain @click="openEditDrawer(sug)">
              编辑
            </el-button>
            <el-button size="small" type="danger" plain @click="deleteSuggestion(sug.id)">
              删除
            </el-button>
          </div>
        </el-card>
      </div>

      <el-empty
        v-else
        description="暂无符合条件的建议"
        :image-size="100"
      />
    </section>

    <!-- 编辑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      title="编辑建议"
      direction="rtl"
      size="400px"
      :before-close="handleCloseDrawer"
    >
      <el-form ref="editFormRef" label-position="top">
        <el-form-item label="主题">
          <el-select v-model="editingSuggestion.topic" style="width: 100%">
            <el-option
              v-for="t in topics"
              :key="t.value"
              :label="t.label"
              :value="t.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="editingSuggestion.content"
            type="textarea"
            :rows="5"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 12px">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" @click="saveFromDrawer">保存</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

// ====== 主题配置 ======
const topics = [
  { value: 'bug', label: '问题反馈' },
  { value: 'feature', label: '功能建议' },
  { value: 'ui', label: '界面优化' },
  { value: 'other', label: '其他' }
]

const getTopicLabel = (val) => topics.find(t => t.value === val)?.label || '其他'
const getTagType = (val) => {
  const map = { bug: 'danger', feature: 'primary', ui: 'success', other: 'info' }
  return map[val] || 'info'
}

// ====== 技术栈数据 ======
const techStack = [
  { name: 'Vue 3', icon: '🟩', desc: '组合式 API，响应式系统' },
  { name: 'Element Plus', icon: '✨', desc: '现代化 Vue 3 UI 组件库' },
  { name: 'localStorage and axios', icon: '💾', desc: '前端本地存储 + HTTP 请求库' },
  { name: 'SCSS', icon: '🎨', desc: 'CSS 预处理器' },
  { name: 'Vite', icon: '⚡', desc: '极速构建工具' }
]

// ====== 响应式状态 ======
const newContent = ref('')
const newTopic = ref('other')
const suggestions = ref([])
const currentTopic = ref(null)

const filteredSuggestions = computed(() => {
  if (currentTopic.value === null) return suggestions.value
  return suggestions.value.filter(s => s.topic === currentTopic.value)
})

// 抽屉相关
const drawerVisible = ref(false)
const editingSuggestion = ref({ id: null, topic: 'other', content: '' })


// 加载与保存
const loadFromStorage = () => {
  const saved = localStorage.getItem('site_suggestions_v2')
  if (saved) {
    try {
      suggestions.value = JSON.parse(saved).map(s => ({ ...s }))
    } catch (e) {
      console.error('解析失败', e)
      suggestions.value = []
    }
  }
}

const saveToStorage = () => {
  const data = suggestions.value.map(({ id, topic, content, createdAt }) => ({
    id,
    topic,
    content,
    createdAt
  }))
  localStorage.setItem('site_suggestions_v2', JSON.stringify(data))
}

const formatDate = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ====== CRUD 操作 ======

const addSuggestion = () => {
  const content = newContent.value.trim()
  if (!content) return

  suggestions.value.unshift({
    id: Date.now(),
    topic: newTopic.value,
    content,
    createdAt: new Date().toISOString()
  })

  saveToStorage()
  newContent.value = ''
  newTopic.value = 'other'
  ElMessage.success('建议提交成功！')
}

// 打开抽屉并复制当前建议数据
const openEditDrawer = (sug) => {
  editingSuggestion.value = { ...sug }
  drawerVisible.value = true
}

// 从抽屉保存
const saveFromDrawer = () => {
  const content = editingSuggestion.value.content.trim()
  if (!content) {
    ElMessage.warning('建议内容不能为空')
    return
  }

  // 更新原数组中的对应项
  const index = suggestions.value.findIndex(s => s.id === editingSuggestion.value.id)
  if (index !== -1) {
    suggestions.value[index] = { ...editingSuggestion.value }
    saveToStorage()
    ElMessage.success('更新成功！')
  }

  drawerVisible.value = false
}

// 取消编辑（可选：自动恢复，但这里直接关闭即可）
const handleCloseDrawer = (done) => {
  // 如果需要确认是否放弃修改，可加 MessageBox
  done()
}

const deleteSuggestion = (id) => {
  ElMessageBox.confirm('确定要删除这条建议吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    suggestions.value = suggestions.value.filter(s => s.id !== id)
    saveToStorage()
    ElMessage.success('删除成功！')
  })
}

onMounted(() => {
  loadFromStorage()
})
</script>

<style scoped lang="scss">
.about-site {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #303133;
  }

  .tech-section {
    margin-bottom: 3rem;

    .tech-card {
      height: 100%;
      .tech-content {
        display: flex;
        gap: 12px;
        align-items: flex-start;
      }
      .tech-icon {
        font-size: 1.4rem;
        line-height: 1;
      }
      h3 {
        margin: 0 0 6px 0;
        font-size: 1.1rem;
        color: #409eff;
      }
      p {
        margin: 0;
        color: #606266;
        font-size: 0.95rem;
      }
    }
  }

  .suggestion-section {
    .topic-filter {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 16px;
    }

    .form-card {
      margin-bottom: 2rem;
    }

    .suggestions-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .suggestion-card {
      p {
        margin: 8px 0 12px 0;
        line-height: 1.6;
      }
      .text-muted {
        display: block;
        color: #909399;
        font-size: 0.85rem;
        margin-bottom: 12px;
      }
      .card-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }
    }
  }
}
</style>