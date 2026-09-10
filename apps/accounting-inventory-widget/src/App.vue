<template>
  <Navigation class="sticky top-0 py-lg px-sm">
    <template #left> My Assigned Items </template>
    <template #right>
      <div class="flex justify-evenly gap-sm">
        <Button
          @click="layoutCols = 1"
          :class="['py-sm', { active: layoutCols === 1 }]"
          ><Icon icon="bi:dash-square" width="1em"
        /></Button>
        <Button
          @click="layoutCols = 2"
          :class="['py-sm', { active: layoutCols === 2 }]"
          ><Icon icon="bi:layout-split" width="1em"
        /></Button>
        <Button
          @click="layoutCols = 3"
          :class="['py-sm', { active: layoutCols === 3 }]"
          ><Icon icon="bi:layout-three-columns" width="1em"
        /></Button>
      </div>
    </template>
  </Navigation>
  <Container>
    <Grid :cols="layoutCols">
      <Card v-for="(item, index) in allItems">
        <template #title>
          <div class="flex justify-between gap-lg w-full items-baseline px-md">
            <Grid class="text-center">
              <div class="text-2xl font-thin">{{ item.stock_number }}</div>
              <div>
                <Badge :variant="getStatusVariant(item)" class="w-full">{{
                  item.status?.text || 'Incoming'
                }}</Badge>
              </div>
            </Grid>
            <Grid class="text-center">
              <div class="text-4xl font-thin">{{ item.store_name?.text }}</div>
              <div><DateDisplay :date="item.created_date?.text || ''" /></div>
            </Grid>
            <Grid>
              <div>
                <ReversalCheckbox
                  label="Reversal?"
                  disabled
                  :name="item.uid"
                  :uid="index"
                  showLabel
                  row
                />
              </div>
              <div />
            </Grid>
          </div>
        </template>
        <template #body>
          <Grid :cols="layoutCols > 1 ? 1 : 2">
            <div class="my-md">
              <Grid :cols="!hasPayoff(item) ? 5 : 4">
                <DataDisplay
                  label="priority"
                  :value="item.priority?.text || '-'"
                />
                <DataDisplay
                  label="origin"
                  :value="
                    item.new_origin?.text || item.used_origin?.text || '-'
                  "
                />
                <DataDisplay
                  label="transaction method"
                  :value="
                    item.wholesale_transaction_method?.text ||
                    item.auction_transaction_method?.text ||
                    '-'
                  "
                />
                <DataDisplay
                  label="title or payoff"
                  :value="item.title_or_payoff?.text || '-'"
                />
                <DataDisplay
                  v-if="!hasPayoff(item)"
                  label="title status"
                  :value="item.title_status?.text || '-'"
                />
              </Grid>
              <div v-if="layoutCols > 1">
                <FormTextarea
                  name="additional"
                  disabled
                  :placeholder="item.form_notes?.text || 'No Notes'"
                >
                  <small>NOTES</small>
                </FormTextarea>
              </div>
              <Container v-if="layoutCols > 1">
                <Grid :cols="attachmentGridSize">
                  <AttachmentDisplay
                    v-for="(attachment, index) in item.attachments?.text?.split(
                      ','
                    )"
                    :attachment
                    :key="`${item.stock_number}-attachment-${index}`"
                  />
                </Grid>
              </Container>
              <Container
                v-if="hasPayoff(item)"
                class="border border-brdr m-lg rounded-xl"
              >
                <Grid :cols="6">
                  <DataDisplay
                    label="lien holder"
                    :value="item.lien_holder?.text || '-'"
                  />
                  <DataDisplay
                    label="payoff amount"
                    :value="item.payoff_amount?.text || '-'"
                  />
                  <DataDisplay
                    label="per diem"
                    :value="item.per_diam?.text || '-'"
                  />
                  <DateDisplay :date="item.good_till_date?.text || '-'"
                    >GOOD TILL</DateDisplay
                  >
                  <DataDisplay
                    label="payment tracking"
                    :value="item.payment_tracking?.text || '-'"
                  />
                  <DataDisplay
                    label="check status"
                    :value="item.check_status?.text || '-'"
                  />
                </Grid>
              </Container>
            </div>
            <div v-if="layoutCols === 1">
              <FormTextarea
                name="additional"
                disabled
                :placeholder="item.form_notes?.text || 'No Notes'"
              >
                <small>NOTES</small>
              </FormTextarea>
            </div>
          </Grid>
          <Container v-if="layoutCols === 1">
            <Grid :cols="attachmentGridSize">
              <AttachmentDisplay
                v-for="(attachment, index) in item.attachments?.text?.split(
                  ','
                )"
                :attachment
                :key="`${item.stock_number}-attachment-${index}`"
              />
            </Grid>
          </Container>
        </template>
        <template #footer>
          <div
            :class="[
              'flex w-full gap-md mt-md',
              {
                'justify-end': layoutCols === 1,
                'justify-evenly': layoutCols === 2,
                'justify-between': layoutCols === 3,
              },
            ]"
          >
            <Button variant="success" @click="() => selectDone(item)" outlined
              >DONE</Button
            >
            <Button
              variant="missing"
              @click="() => selectMissing(item)"
              outlined
              >MISSING VENDOR</Button
            >
            <Button variant="danger" @click="() => selectReject(item)" outlined
              >REJECT</Button
            >
          </div>
        </template>
      </Card>
      <div v-if="!allItems.length">
        <Card v-if="hasAvailableItem">
          <template #title>ACCEPT INCOMMING VEHICLE</template>
          <template #body>
            <Button variant="success" outlined @click="claimVehicle"
              >CLAIM ITEM</Button
            >
          </template>
        </Card>
        <Card v-else>
          <template #title>NO VEHICLES AVAILABLE</template>
        </Card>
      </div>
    </Grid>
  </Container>
  <Popup
    v-if="selectedStatus && currentItem"
    :title="selectedStatus"
    :description="confirmationText"
    :item="currentItem"
    @close="closePopup"
    @confirm="changeStatus"
  />
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  AttachmentDisplay,
  Badge,
  Button,
  Card,
  Container,
  DataDisplay,
  DateDisplay,
  FormTextarea,
  Grid,
  Navigation,
  Popup,
  ReversalCheckbox,
} from '@mim-workspace/ui';
import { BOARDS, Columns } from '@mim-workspace/constants';
import { InventoryItem } from '@mim-workspace/models';
import {
  CompleteItem,
  GetAssignedItems,
  GetItemData,
  GetUnassignedItems,
} from '@mim-workspace/queries';
import { Icon } from '@iconify/vue';

import type { ConfirmStatus, ItemsPageResponse } from '@mim-workspace/types';
import { SeamlessApiClient } from '@mondaydotcomorg/api';

const client = new SeamlessApiClient();
const layoutCols = ref(1);
const allItems = ref<InventoryItem[]>([]);
const unassignedItems = ref<InventoryItem[] | null>(null);
const selectedStatus = ref<string | null>(null);
const confirmationText = ref<string>('');
const currentItem = ref<InventoryItem | null>(null);

onMounted(async () => {
  try {
    const { data } = await client.request<ItemsPageResponse>(GetAssignedItems, {
      boardId: [BOARDS.current.id, BOARDS.previous.id, BOARDS.printing.id],
    });

    if (data) {
      const boards = data.data.boards;
      allItems.value = boards.flatMap((board) => {
        const items = board.items_page.items;
        return items.flatMap((item) => {
          const specialCols = Object.values(BOARDS).find(
            (col) => col.id === Number(item.board.id)
          )?.columns;
          return new InventoryItem(item, { ...Columns, ...specialCols });
        });
      });
    }
  } catch (err) {
    console.error('Assigned Items Error:', err);
  }

  try {
    const { data } = await client.request<ItemsPageResponse>(
      GetUnassignedItems,
      { boardId: BOARDS.current.id }
    );

    if (data) {
      const boards = data.data.boards;
      unassignedItems.value = boards.flatMap((board) => {
        const items = board.items_page.items;
        return items.map((item) => {
          return new InventoryItem(item, {
            ...Columns,
            ...BOARDS.current.columns,
          });
        });
      });
    }
  } catch (err) {
    console.error('Get Unassigned Error:', err);
  }
});

const hasAvailableItem = computed(() => {
  return unassignedItems.value && unassignedItems.value.length > 0;
});

const attachmentGridSize = computed(() => {
  switch (layoutCols.value) {
    case 2:
      return 9;
    case 3:
      return 6;
    default:
      return 19;
  }
});

function hasPayoff(item: InventoryItem) {
  return item.title_or_payoff?.text?.toLowerCase() === 'payoff';
}

function getStatusVariant(item: InventoryItem) {
  switch (item.status?.text?.toLowerCase()) {
    case 'working':
      return 'warning';
    case 'done':
      return 'success';
    case 'reject':
      return 'danger';
    case 'updated':
      return 'update';
    case 'missing vendor':
      return 'missing';
    default:
      return 'secondary';
  }
}

function selectDone(item: InventoryItem) {
  selectedStatus.value = `Confirm Completion of ${item.stock_number}`;
  confirmationText.value = 'Send the Vehicle to the Printers!';
  currentItem.value = item;
}

function selectMissing(item: InventoryItem) {
  selectedStatus.value = `Confirm ${item.stock_number} is missing the Vendor? `;
  confirmationText.value = `This will Mark the vehicle as Missing the Vendor for payment and send out 
  Emails to resolve the issue.  Once resolved, the vehicle will come back into rotation to 
  be reworked.`;
  currentItem.value = item;
}

function selectReject(item: InventoryItem) {
  selectedStatus.value = `Confirm Rejection of ${item.stock_number}!`;
  confirmationText.value = `Reject the vehicle and Send an Email to Correct the Issue.  
  Please provide a note to help resolve the issue.  Once resolved, the vehicle 
  will come back as 'Updated', to rework.`;
  currentItem.value = item;
}

function claimVehicle() {
  // TODO: Write a function to claim the first available unclaimed vehicle
}

function closePopup() {
  selectedStatus.value = null;
  confirmationText.value = '';
}

async function changeStatus(data: ConfirmStatus) {
  try {
    const boardId = await client.request(GetItemData, {
      itemId: data.item.uid,
    });

    try {
      await client.request(CompleteItem, {
        boardId,
        itemId: data.item.uid,
        newStatus: data.status,
        notesColumn: Columns.inventory_notes,
        notesValue: data.notes,
      });
    } catch (err) {
      console.error('Error Changing Status:', err);
    }
  } catch (err) {
    console.error('Error Fetching Item Data:', err);
  }
}
</script>
