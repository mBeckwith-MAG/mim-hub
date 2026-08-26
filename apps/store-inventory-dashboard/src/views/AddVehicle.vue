<template>
  <Navigation class="py-8.75 px-4" shadowed>
    <template #left>Add a Vehicle</template>
    <template #right>
      <button
        :class="['btn btn-md secondary outlined', { 'hidden' : isDisabled } ]"
        :disabled="isDisabled"
        @click="handleSubmit"
      >
        SUBMIT
      </button>
    </template>
  </Navigation>
  <AddVehicleForm :showPayoff="hasPayoff">
    <template #top-row>
      <Card>
        <template #title>Personal Information</template>
        <template #body>
          <Grid>
            <FormInput
              name="yourName"
              v-model="submitBy"
            />
            <FormInput
              name="yourEmail"
              input-type="email"
              v-model="email"
            />
            <Dropdown name="stores" :options="storeOptions" v-model="storeName">Choose a Store</Dropdown>
          </Grid>
        </template>
      </Card>
      <Card>
        <template #title>Vehicle Information</template>
        <template #body>
          <Grid :cols="2">
            <Dropdown
              name="carType"
              :options="carTypeOptions"
              v-model="carType"
            >Car Type</Dropdown>
            <Dropdown
              v-if="carType"
              :name="`${carType}CarOrigin`"
              :options="carType?.includes('New') ? newOriginOptions : usedOriginOptions"
              v-model="origin"
            >Car Origin</Dropdown>
            <Dropdown
              v-if="origin?.includes('Wholesale')"
              :name="origin.includes('Sale') ? 'specifyTransactionMethod' : 'specifyTypeOfAuction'"
              :options="origin.includes('Sale') ? SaleOptions : PurchaseOptions"
              v-model="transactionMethod"
            >Transaction Method</Dropdown>
            <Dropdown
              v-if="origin?.includes('Street')"
              name="titleOrPayoff"
              :options="titleOrPayoffOptions"
              v-model="titleOrPayoff"
            >Title or Payoff?</Dropdown>
            <Dropdown
              v-if="titleOrPayoff?.includes('Title')"
              name="titleType"
              :options="TitleOptions"
              v-model="titleType"
            >Title Type</Dropdown>
          </Grid>
        </template>
      </Card>
      <Card v-if="hasPayoff">
        <template #title>Payoff Information</template>
        <template #body>
          <Grid>
            <FormInput
              name="lienHolder"
              v-model="lienHolder"
            />
            <FormInput
              name="payoffAmount"
              input-type="number"
              v-model="payoffAmount"
            />
            <FormInput
              name="perDiem"
              input-type="number"
              v-model="perDiem"
            />
            <FormInput 
              name="goodTill" 
              input-type="date" 
              v-model="goodTill"
            />
          </Grid>
        </template>
      </Card>
    </template>
    <template #bottom-row>
      <Card>
        <template #title>Add Stock Numbers</template>
        <template #body>
          <Grid>
            <FormInput
              name="stockNumber"
              :showLabel="false"
              v-model="stockNumber"
              @keyup.enter="addStockNumber"
            />
            <Grid :cols="3">
              <Badge v-for="(stockNum, index) in stockNumbers" :key="`stock-number-badge-${index}`" @removeBadge="() => removeStockNumber(index)" class="info" closable>{{ stockNum }}</Badge>
            </Grid>
          </Grid>
        </template>
      </Card>
      <Card>
        <template #title>Additional Information</template>
        <template #body>
          <FileUploader @update:files="handleFilesUpdate" />
          <div class="flex justify-evenly">
            <div class="grid gap-sm w-full text-center mt-xl">
              <label for="reversal-checkbox">Reversal</label>
              <input type="checkbox" id="reversal-checkbox" class="ms-auto me-auto reversal-checkbox" v-model="isReversal" />
              <small>Check if this should be considered a Reversal</small>
            </div>
            <textarea
              v-model="formNotes"
              cols="70"
              rows="5"
              placeholder="Additional Notes..."
            />
          </div>
        </template>
      </Card>
    </template>
  </AddVehicleForm>
</template>
<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import { BASE_URL, Stores, titleOrPayoffOptions, TitleOptions, SaleOptions, PurchaseOptions, carTypeOptions, newOriginOptions, usedOriginOptions } from '@mim-workspace/constants';
import { Card, AddVehicleForm, FormInput, Navigation, Grid, Dropdown, Badge, FileUploader } from '@mim-workspace/ui';

const submitBy: Ref<string | null> = ref(null)
const email: Ref<string | null> = ref(null)
const storeName: Ref<string | null> = ref(null)
const carType: Ref<string | null> = ref(null)
const origin: Ref<string | null> = ref(null)
const transactionMethod: Ref<string | null> = ref(null)
const titleOrPayoff: Ref<string | null> = ref(null)
const titleType: Ref<string | null> = ref(null)
const lienHolder: Ref<string | null> = ref(null)
const payoffAmount: Ref<number | null> = ref(null)
const perDiem: Ref<number | null> = ref(null)
const goodTill: Ref<string | null> = ref(null)
const formNotes: Ref<string | null> = ref(null)
const isReversal: Ref<boolean> = ref(false)
const attachments: Ref<File[]> = ref([])
const stockNumbers: Ref<Array<String>> = ref([])
const stockNumber: Ref<String | null> = ref(null)

const hasPayoff = computed(() => {
  return titleOrPayoff.value === 'Payoff'
})

const storeOptions = computed(() => {
  return Stores.map(store => store.name)
})

function handleFilesUpdate(filesPayload: File[]) {
  attachments.value = filesPayload
}


function addStockNumber() {
  if (stockNumber.value) {
    stockNumbers.value.push(stockNumber.value)
    stockNumber.value = null
  }
}

function removeStockNumber(idx: number) {
  stockNumbers.value.splice(idx, 1)
}

const isDisabled = computed(() => {
  return (
    !submitBy.value ||
    !email.value ||
    !carType.value ||
    !origin.value ||
    stockNumbers.value.length < 1 ||
    attachments.value.length < 1
  )
})

async function handleSubmit() {
  if (!BASE_URL) {
    console.error("BASE_URL is not set — cannot submit.");
    return;
  }
  
  const formData = new FormData()

  formData.append('submitBy', submitBy.value || '')
  formData.append('email', email.value || '')
  formData.append('storeName', storeName.value || '')
  formData.append('carType', carType.value || '')
  formData.append('origin', origin.value || '')
  formData.append('transactionMethod', transactionMethod.value || '')
  formData.append('titleOrPayoff', titleOrPayoff.value || '')
  formData.append('titleType', titleType.value || '')
  formData.append('lienHolder', lienHolder.value || '')
  formData.append('payoffAmount', payoffAmount.value?.toString() || '')
  formData.append('perDiem', perDiem.value?.toString() || '')
  formData.append('goodTill', goodTill.value || '')
  formData.append('formNotes', formNotes.value || '')
  formData.append('isReversal', isReversal.value.toString())
  formData.append('stockNumbers', JSON.stringify(stockNumbers.value))

  if (attachments.value) {
    for (let i = 0; i < attachments.value.length; i++) {
      formData.append('attachments', attachments.value[i])
    }
  }

  try {
    const response = await fetch(`${BASE_URL}/inventory/add-vehicle`, {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      const data = await response.json()
      console.log("Form Data", data)
    } else {
      console.error('Submission failed:', response.statusText)
    }
  } catch (error) {
    console.error('Network error occurred:', error)
  } finally {
    submitBy.value = null
    email.value = null
    storeName.value = null
    carType.value = null
    origin.value = null
    transactionMethod.value = null
    titleOrPayoff.value = null
    titleType.value = null
    lienHolder.value = null
    payoffAmount.value = null
    perDiem.value = null
    goodTill.value = null
    formNotes.value = null
    isReversal.value = false
    attachments.value = []
    stockNumbers.value = []
  }
}

function formDebug() {
  console.log("Results", {
    submitBy: submitBy.value,
    email: email.value,
    store: storeName.value,
    car_type: carType.value,
    origin: origin.value,
    transMth: transactionMethod.value,
    title: titleOrPayoff.value,
    titleType: titleType.value,
    lien: lienHolder.value,
    payoffAmount: payoffAmount.value,
    perdiem: perDiem.value,
    goodTill: goodTill.value,
    notes: formNotes.value,
    reversal: isReversal.value,
    atts: attachments.value,
    nmbs: stockNumbers.value
  })
}
</script>