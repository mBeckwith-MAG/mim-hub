<template>
  <Navigation class="py-8.75 px-4" shadowed>
    <template #left>Add a Vehicle</template>
    <template #right>
      <Button
        variant="secondary"
        outlined
        :disabled="isDisabled"
        @click="handleSubmit"
        >SUBMIT</Button
      >
    </template>
  </Navigation>

  <VehicleForm :showPayoff="hasPayoff">
    <template #top-row>
      <Card>
        <template #title>Personal Information</template>
        <template #body>
          <Grid>
            <FormInput name="yourName" hasBorder v-model="submitBy"
              >Your Name</FormInput
            >
            <FormInput
              name="yourEmail"
              hasBorder
              inputType="email"
              v-model="email"
              >Your Email</FormInput
            >
            <Dropdown
              name="stores"
              :options="storeOptions"
              v-model="storeName"
              required
              forceLabel
              >Choose a Store</Dropdown
            >
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
              required
              forceLabel
              >Car Type</Dropdown
            >
            <Dropdown
              v-if="carType"
              :name="`${carType}CarOrigin`"
              :options="
                carType?.includes('New') ? newOriginOptions : usedOriginOptions
              "
              v-model="origin"
              required
              forceLabel
              >Car Origin</Dropdown
            >
            <Dropdown
              v-if="origin?.includes('Wholesale')"
              :name="
                origin.includes('Sale')
                  ? 'specifyTransactionMethod'
                  : 'specifyTypeOfAuction'
              "
              :options="origin.includes('Sale') ? SaleOptions : PurchaseOptions"
              v-model="transactionMethod"
              required
              forceLabel
              >Transaction Method</Dropdown
            >
            <Dropdown
              v-if="origin?.includes('Street')"
              name="titleOrPayoff"
              :options="titleOrPayoffOptions"
              v-model="titleOrPayoff"
              required
              forceLabel
              >Title or Payoff?</Dropdown
            >
            <Dropdown
              v-if="titleOrPayoff?.includes('Title')"
              name="titleType"
              :options="TitleOptions"
              v-model="titleType"
              required
              forceLabel
              >Title Type</Dropdown
            >
          </Grid>
        </template>
      </Card>

      <Card v-if="hasPayoff">
        <template #title>Payoff Information</template>
        <template #body>
          <Grid>
            <FormInput name="lienHolder" v-model="lienHolder" hasBorder
              >Lien Holder</FormInput
            >
            <FormInput
              name="payoffAmount"
              input-type="number"
              v-model.number="payoffAmount"
              hasBorder
              >Payoff Amount</FormInput
            >
            <FormInput
              name="perDiem"
              input-type="number"
              v-model.number="perDiem"
              hasBorder
              >Per Diem</FormInput
            >
            <FormInput
              name="goodTill"
              input-type="date"
              v-model.number="goodTill"
              hasBorder
              >Good Till</FormInput
            >
          </Grid>
        </template>
      </Card>
    </template>

    <template #bottom-row>
      <Card>
        <template #title>
          <div class="w-full">
            <FormInput
              name="stockNumber"
              v-model="stockNumber"
              @keyup.enter="addStockNumber"
              hasBorder
              >Add Stock Number</FormInput
            >
          </div>
        </template>
        <template #body>
          <Grid :cols="8">
            <Badge
              v-for="(stockNum, index) in stockNumbers"
              :key="`stock-number-badge-${index}`"
              @removeBadge="() => removeStockNumber(index)"
              class="info"
              closable
              >{{ stockNum }}</Badge
            >
          </Grid>
        </template>
      </Card>

      <Card>
        <template #title>Additional Information</template>
        <template #body>
          <Grid :cols="2">
            <Grid>
              <div>
                <FileUploader @files-selected="handleFilesSelected" />
              </div>
              <Grid class="gap-sm w-full text-center mt-xl">
                <label for="reversal-checkbox">Reversal</label>
                <input
                  type="checkbox"
                  id="reversal-checkbox"
                  class="ms-auto me-auto reversal-checkbox"
                  v-model="isReversal"
                />
                <small>Check if this should be considered a Reversal</small>
              </Grid>
            </Grid>

            <div class="h-full flex flex-col justify-start">
              <p
                class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-sm"
              >
                Attachments Preview ({{ extendedFiles.length }})
              </p>
              <FilePreviewList
                v-if="extendedFiles.length > 0"
                :items="extendedFiles"
                :cols="5"
                @remove="removeFile"
              />
              <div
                v-else
                class="flex flex-col items-center justify-center border-2 border-dotted border-gray-200 dark:border-gray-700 rounded-lg p-6 h-40 text-center text-xs text-gray-400 dark:text-gray-500"
              >
                No attachments uploaded yet
              </div>
            </div>
          </Grid>
          <FormTextarea name="additional" v-model="formNotes" canEdit
            >Additional Notes</FormTextarea
          >
        </template>
      </Card>
    </template>
  </VehicleForm>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import VehicleForm from '../layouts/VehicleForm.vue';
import {
  BASE_URL,
  Stores,
  titleOrPayoffOptions,
  TitleOptions,
  SaleOptions,
  PurchaseOptions,
  carTypeOptions,
  newOriginOptions,
  usedOriginOptions,
} from '@mim-workspace/constants';
import {
  Button,
  Card,
  FormInput,
  Navigation,
  Grid,
  Dropdown,
  Badge,
  FileUploader,
  FilePreviewList,
  FormTextarea,
} from '@mim-workspace/ui';
import type { RawFile } from '@mim-workspace/types';

const submitBy = ref<string | undefined>(undefined);
const email = ref<string | undefined>(undefined);
const storeName = ref<string | undefined>(undefined);
const carType = ref<string | undefined>(undefined);
const origin = ref<string | undefined>(undefined);
const transactionMethod = ref<string | undefined>(undefined);
const titleOrPayoff = ref<string | undefined>(undefined);
const titleType = ref<string | undefined>(undefined);
const lienHolder = ref<string | undefined>(undefined);
const goodTill = ref<string | undefined>(undefined);

const payoffAmount = ref<number | undefined>(undefined);
const perDiem = ref<number | undefined>(undefined);

const stockNumbers = ref<string[]>([]);
const stockNumber = ref<string | undefined>(undefined);

const isReversal = ref<boolean>(false);
const formNotes = ref<string>('');
const extendedFiles = ref<RawFile[]>([]);

const attachments = computed(() => {
  return extendedFiles.value.map((item) => item.file);
});

const hasPayoff = computed(() => {
  return titleOrPayoff.value === 'Payoff';
});

const storeOptions = computed(() => {
  return Stores.map((store) => store.name);
});

function handleFilesSelected(newFiles: File[]) {
  newFiles.forEach((currentFile) => {
    const isDuplicate = extendedFiles.value.some(
      (f) =>
        f.file.name === currentFile.name && f.file.size === currentFile.size
    );
    if (isDuplicate) return;

    let previewUrl: string | null = null;
    if (currentFile.type.startsWith('image/')) {
      previewUrl = URL.createObjectURL(currentFile);
    }

    extendedFiles.value.push({
      id: crypto.randomUUID(),
      file: currentFile,
      preview: previewUrl || '',
    });
  });
}

function removeFile(idToRemove: string) {
  const index = extendedFiles.value.findIndex((item) => item.id === idToRemove);
  if (index !== -1) {
    if (extendedFiles.value[index].preview) {
      URL.revokeObjectURL(extendedFiles.value[index].preview!);
    }
    extendedFiles.value.splice(index, 1);
  }
}

function clearAttachments() {
  extendedFiles.value.forEach((item) => {
    if (item.preview) {
      URL.revokeObjectURL(item.preview);
    }
  });
  extendedFiles.value = [];
}

function addStockNumber() {
  if (stockNumber.value) {
    stockNumbers.value.push(stockNumber.value);
    stockNumber.value = undefined;
  }
}

function removeStockNumber(idx: number) {
  stockNumbers.value.splice(idx, 1);
}

const isDisabled = computed(() => {
  return (
    !submitBy.value ||
    !email.value ||
    !carType.value ||
    !origin.value ||
    stockNumbers.value.length < 1 ||
    attachments.value.length < 1
  );
});

async function handleSubmit() {
  if (!BASE_URL) {
    console.error('BASE_URL is not set — cannot submit.');
    return;
  }

  const formData = new FormData();
  formData.append('submitBy', submitBy.value || '');
  formData.append('email', email.value || '');
  formData.append('storeName', storeName.value || '');
  formData.append('carType', carType.value || '');
  formData.append('origin', origin.value || '');
  formData.append('transactionMethod', transactionMethod.value || '');
  formData.append('titleOrPayoff', titleOrPayoff.value || '');
  formData.append('titleType', titleType.value || '');
  formData.append('lienHolder', lienHolder.value || '');
  formData.append('payoffAmount', payoffAmount.value?.toString() || '');
  formData.append('perDiem', perDiem.value?.toString() || '');
  formData.append('goodTill', goodTill.value || '');
  formData.append('formNotes', formNotes.value || '');
  formData.append('isReversal', isReversal.value.toString());
  formData.append('stockNumbers', JSON.stringify(stockNumbers.value));

  attachments.value.forEach((file) => {
    formData.append('attachments', file);
  });

  try {
    const response = await fetch(`${BASE_URL}/inventory/add-vehicle`, {
      method: 'POST',
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      console.log('Form Data', data);
    } else {
      console.error('Submission failed:', response.statusText);
    }
  } catch (error) {
    console.error('Network error occurred:', error);
  } finally {
    submitBy.value = undefined;
    email.value = undefined;
    storeName.value = undefined;
    carType.value = undefined;
    origin.value = undefined;
    transactionMethod.value = undefined;
    titleOrPayoff.value = undefined;
    titleType.value = undefined;
    lienHolder.value = undefined;
    payoffAmount.value = undefined;
    perDiem.value = undefined;
    goodTill.value = undefined;
    formNotes.value = '';
    isReversal.value = false;
    stockNumbers.value = [];

    clearAttachments();
  }
}
</script>
