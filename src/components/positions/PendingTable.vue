<template>
  <div class="min-w-full font-sans select-none">
    <table class="w-full border-collapse text-[11px] table-fixed">
      <thead class="bg-[#f1f1f1] dark:bg-[#0a0a0a] border-b border-[#e2e5ea] dark:border-[#1a1a1a]">
        <tr class="h-[28px] text-[11px] text-[#737c89] dark:text-[#7e8d9f] font-normal">
          <th class="px-2 text-left font-normal w-[45px] min-w-[45px]">ID</th>
          <th class="px-1.5 text-left font-normal w-[115px] min-w-[115px]">Time</th>
          <th class="px-1.5 text-left font-normal w-[80px] min-w-[80px]">
            <span class="inline-flex items-center gap-1">
              Symbol <span class="text-[#ff3b30] text-[10px] font-bold">⇂⇃</span>
            </span>
          </th>
          <th class="px-1 text-center font-normal w-[52px] min-w-[52px]">Order</th>
          <th class="px-1 text-center font-normal w-[44px] min-w-[44px]">Lot</th>
          <th class="px-1.5 text-right font-normal w-[68px] min-w-[68px]">Price</th>
          <th class="px-1 text-right font-normal w-[62px] min-w-[62px]">Partial</th>
          <th class="px-1 text-right font-normal w-[46px] min-w-[46px]">SL</th>
          <th class="px-1 text-right font-normal w-[46px] min-w-[46px]">TP</th>
          <th class="px-1.5 text-right font-normal w-[50px] min-w-[50px]">SWAP</th>
          <th class="px-1.5 text-right font-normal w-[68px] min-w-[68px]">LTP</th>
          <th class="px-1.5 text-right font-normal w-[86px] min-w-[86px]">PROFIT</th>
          <th class="w-[36px] min-w-[36px] px-1 text-center font-normal"></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="13" class="text-center text-[#9aa3b0] py-8 text-xs bg-white dark:bg-[#000000]">
            No Order(s) Found
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
</script>
