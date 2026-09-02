<template>
  <Navigation class="py-8.75 px-4" shadowed>
    <template #left>Edit: {{ stockNumber }}</template>
    <template #right>
      <Button
        variant="secondary"
        outlined
        :disabled="!hasChanged"
        @click="handleUpdate"
        >UPDATE</Button
      >
    </template>
  </Navigation>

  <div
    v-if="status === 'Reject' && hasChanged"
    class="absolute top-0 right-0 pt-md pe-md"
  >
    <div class="btn text-center text-xl font-thin" @click="handleUpdate">
      UPDATE
    </div>
  </div>

  <div class="grid p-4">
    <div class="grid gap-md">
      <Grid :cols="hasPayoff ? 3 : 2">
        <Card>
          <template #title>
            <div class="w-full">BASIC INFORMATION</div>
            <div class="flex justify-end w-1/4 text-center items-center">
              <label for="reversal-checkbox">Reversal?</label>
              <input
                type="checkbox"
                id="reversal-checkbox"
                class="ms-auto me-auto reversal-checkbox"
                v-model="isReversal"
                :disabled="!canEdit"
              />
            </div>
          </template>
          <template #body>
            <Grid :cols="3" class="my-2x">
              <DataDisplay label="Store" :value="storeName || ''" />
              <DataDisplay label="Car Type" :value="carType || ''" />
              <DataDisplay label="Status" :value="status || 'Incoming'" />
              <DataDisplay label="Submit By" :value="submitBy || ''" />
              <DataDisplay label="Email" :value="email || ''" />
            </Grid>
          </template>
          <template #footer>
            <DateDisplay v-if="createdDate" :date="createdDate"
              >CREATED DATE</DateDisplay
            >
            <DataDisplay
              v-else
              label="Created Date"
              :value="createdDate || 'Doesn\'t Exist'"
            />
            <DateDisplay v-if="startDate" :date="startDate"
              >START DATE</DateDisplay
            >
            <DataDisplay
              v-else
              label="Start Date"
              :value="startDate || 'Incoming'"
            />
            <DateDisplay v-if="endDate" :date="endDate">END DATE</DateDisplay>
            <DataDisplay
              v-else
              label="End Date"
              :value="endDate || 'Not Complete'"
            />
          </template>
        </Card>

        <Card v-if="hasPayoff">
          <template #title>PAYOFF INFORMATION</template>
          <template #body>
            <Grid :cols="2">
              <DataDisplay label="Lien Holder" :value="lienHolder || ''" />
              <DataDisplay
                label="Payoff Amount"
                :value="String(payoffAmount) || ''"
              />
              <DataDisplay label="Per Diem" :value="String(perDiem) || ''" />
              <div v-if="goodTill">
                <FormInput v-if="canEdit" name="goodTillDate"
                  >Good Till Date</FormInput
                >
                <DataDisplay label="Good Till Date" :value="goodTill || ''" />
              </div>
              <DataDisplay label="Check Status" :value="checkStatus || ''" />
              <DataDisplay
                label="Payment Tracking"
                :value="paymentTracking || ''"
              />
            </Grid>
          </template>
        </Card>

        <Card v-else>
          <template #title>
            <div v-if="!inventoryNotes">INVENTORY NOTES</div>
          </template>
          <template #body>
            <Container>
              <FormTextarea
                v-if="inventoryNotes"
                name="inventory"
                v-model="inventoryNotes"
              ></FormTextarea>
              <DataDisplay label="" value="No Notes" />
            </Container>
          </template>
        </Card>
      </Grid>
      <Grid :cols="hasPayoff ? 3 : 2">
        <Card v-if="hasPayoff">
          <template #title>
            <div v-if="!inventoryNotes">INVENTORY NOTES</div>
          </template>
          <template #body>
            <Container>
              <FormTextarea
                v-if="inventoryNotes"
                name="inventory"
                v-model="inventoryNotes"
              ></FormTextarea>
              <DataDisplay v-else label="" value="No Notes" />
            </Container>
          </template>
        </Card>
        <Card>
          <template #title>
            <div>FORM NOTES</div>
          </template>
          <template #body>
            <Container>
              <FormTextarea
                v-if="combinedNotes"
                name="form"
                v-model="combinedNotes"
                :canEdit
              ></FormTextarea>
              <DataDisplay v-else label="" value="No Notes" />
            </Container>
          </template>
        </Card>

        <Card>
          <template #title>ATTACHMENTS</template>
          <template #body>
            <Grid :cols="2">
              <FileUploader @files-selected="handleFilesSelected" />

              <div class="h-full flex flex-col justify-start">
                <div v-if="attachments && attachments.length">
                  <p
                    class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-sm"
                  >
                    Attachments Preview ({{ attachments.length }})
                  </p>
                  <FilePreviewList
                    v-if="attachments.length > 0"
                    :items="attachments"
                    :cols="5"
                    @remove="removeFile"
                  />
                </div>
                <div
                  v-else
                  class="flex flex-col items-center justify-center border-2 border-dotted border-gray-200 dark:border-gray-700 rounded-lg p-6 h-40 text-center text-xs text-gray-400 dark:text-gray-500"
                >
                  No attachments uploaded yet
                </div>
              </div>
            </Grid>
          </template>
        </Card>
      </Grid>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { InventoryItem } from '@mim-workspace/models';
import {
  CurrentBoardColumns,
  BASE_URL,
  PreviousBoardColumns,
  PrintingBoardColumns,
} from '@mim-workspace/constants';
import type { Attachment, Item, RawFile, RawFiles } from '@mim-workspace/types';

import {
  Button,
  Card,
  Container,
  DateDisplay,
  DataDisplay,
  FilePreviewList,
  FileUploader,
  FormInput,
  FormTextarea,
  Grid,
  Navigation,
} from '@mim-workspace/ui';

const route = useRoute();
const router = useRouter();

const hasVehicle = ref(false);
const UID = ref<string | undefined>(undefined);
const submitBy = ref<string | undefined>(undefined);
const email = ref<string | undefined>(undefined);
const storeName = ref<string | undefined>(undefined);
const carType = ref<string | undefined>(undefined);
const origin = ref<string | undefined>(undefined);
const transactionMethod = ref<string | undefined>(undefined);
const titleOrPayoff = ref<string | undefined>(undefined);
const titleType = ref<string | undefined>(undefined);
const lienHolder = ref<string | undefined>(undefined);
const payoffAmount = ref<number | undefined>(undefined);
const perDiem = ref<number | undefined>(undefined);
const goodTill = ref<string | undefined>(undefined);
const formNotes = ref<string | undefined>(undefined);
const isReversal = ref<boolean>(false);
const existing_attachments = ref<string | undefined>(undefined);
const stockNumber = ref<string | undefined>(undefined);
const status = ref<string | undefined>(undefined);
const checkStatus = ref<string | undefined>(undefined);
const createdDate = ref<string | undefined>(undefined);
const startDate = ref<string | undefined>(undefined);
const endDate = ref<string | undefined>(undefined);
const paymentTracking = ref<string | undefined>(undefined);
const inventoryNotes = ref<string | undefined>(undefined);

const attachments = ref<RawFile[] | null>(null);
const newTitleOrPayoff = ref<string | undefined>(undefined);
const newTitleType = ref<string | undefined>(undefined);
const newLienHolder = ref<string | undefined>(undefined);
const newPayoffAmount = ref<number | undefined>(undefined);
const newPerDiem = ref<number | undefined>(undefined);
const newGoodTill = ref<string | undefined>(undefined);
const newNotes = ref<string | undefined>(undefined);

const extendedFiles = ref<RawFile[]>([]);

const newAttachments = computed(() => {
  return extendedFiles.value.map((item) => item.file);
});

const hasChanged = computed(() => {
  if (
    attachments.value ||
    newTitleOrPayoff.value ||
    newTitleType.value ||
    newLienHolder.value ||
    newPayoffAmount.value ||
    newPerDiem.value ||
    newGoodTill.value ||
    newNotes.value
  )
    return true;
  return false;
});

const refMapping: Record<string, Ref<any>> = {
  submit_by: submitBy,
  return_email: email,
  store_name: storeName,
  car_type: carType,
  new_origin: origin,
  used_origin: origin,
  transaction_method: transactionMethod,
  title_or_payoff: titleOrPayoff,
  title_type: titleType,
  lien_holder: lienHolder,
  payoff_amount: payoffAmount,
  per_diem: perDiem,
  good_till_date: goodTill,
  form_notes: formNotes,
  reversal: isReversal,
  attachments: existing_attachments,
  stock_number: stockNumber,
  status: status,
  check_status: checkStatus,
  created_date: createdDate,
  start_date: startDate,
  end_date: endDate,
  payment_tracking: paymentTracking,
  inventory_notes: inventoryNotes,
};

onMounted(async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/inventory/edit-vehicle/${route.params.itemId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const { id, name, column_values, board } = data.item.items[0];

    const columnKeys = board.name.toLowerCase().includes('current')
      ? CurrentBoardColumns
      : board.name.toLowerCase().includes('previous')
        ? PreviousBoardColumns
        : PrintingBoardColumns;

    UID.value = id;

    const item: Item = { id, name, column_values };
    const vehicle = new InventoryItem(item, columnKeys);

    for (const key in refMapping) {
      if (key in vehicle) {
        const vehicleValue = vehicle[key as keyof typeof vehicle];

        if (
          vehicleValue &&
          typeof vehicleValue === 'object' &&
          'text' in vehicleValue
        ) {
          if (vehicleValue.text !== null && vehicleValue.text !== '') {
            if (vehicleValue.id === CurrentBoardColumns.attachments) {
              refMapping[key].value = vehicleValue.value || '';
            } else if (typeof refMapping[key].value === 'number') {
              refMapping[key].value = Number(vehicleValue.text);
            } else {
              refMapping[key].value = vehicleValue.text;
            }
          }
        } else if (vehicleValue !== undefined && vehicleValue !== null) {
          refMapping[key].value = vehicleValue;
        }
      }
    }
    hasVehicle.value = true;
  } catch (error) {
    console.error('Failed to load vehicle data:', error);
  }
});

const attachmentList = computed<Attachment[]>(() => {
  const files: Array<Attachment> = [];
  if (existing_attachments.value && existing_attachments.value.length) {
    const parsed: RawFiles = JSON.parse(String(existing_attachments.value));

    return parsed.files.map((file) => {
      return {
        url: String(`${BASE_URL}/assets/${file.assetId}`),
        name: String(file.name),
      };
    });
  }

  return files;
});

const hasPayoff = computed(() => {
  return titleOrPayoff.value === 'Payoff';
});

const canEdit = computed(() => {
  return status.value === 'Reject';
});

const handleAddFile = (files: RawFile[]) => {
  extendedFiles.value = files;
};

async function handleUpdate() {
  const formData = new FormData();

  if (newTitleOrPayoff.value)
    formData.append('titleOrPayoff', newTitleOrPayoff.value);
  if (newTitleType.value) formData.append('titleType', newTitleType.value);
  if (newLienHolder.value) formData.append('lienHolder', newLienHolder.value);
  if (newPayoffAmount.value)
    formData.append('payoffAmount', newPayoffAmount.value?.toString());
  if (newPerDiem.value)
    formData.append('perDiem', newPerDiem.value?.toString());
  if (newGoodTill.value) formData.append('goodTill', newGoodTill.value);
  if (newNotes.value) formData.append('formNotes', newNotes.value);
  formData.append('isReversal', isReversal.value.toString());

  if (attachments.value && attachments.value.length > 0) {
    for (let i = 0; i < attachments.value.length; i++) {
      formData.append('attachments', attachments.value[i].file);
    }
  }

  try {
    const response = await fetch(`${BASE_URL}inventory/update/${UID.value}`, {
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

    clearAttachments();

    router.go(-1);
  }
}

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

const combinedNotes = computed(() => {
  if (newNotes.value) return newNotes.value;
  return formNotes.value;
});

function handleNotes(e: HTMLTextAreaElement) {
  newNotes.value = e.value;
}
</script>
