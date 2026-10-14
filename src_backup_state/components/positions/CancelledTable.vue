<template>
  <div class="min-w-full font-sans select-none">
    <table class="w-full border-collapse text-[11px]">
      <thead class="bg-[#f1f1f1] dark:bg-[#0a0f1a] border-b border-[#e2e5ea] dark:border-[#162032]">
        <tr class="h-[28px] text-[11px] text-[#737c89] dark:text-[#7e8d9f] font-normal">
          <th class="px-3 text-left font-normal">ID</th>
          <th class="px-3 text-left font-normal">Time</th>
          <th class="px-3 text-left font-normal">
            <span class="inline-flex items-center gap-1">
              Symbol <span class="text-[#ff3b30] text-[10px] font-bold">⇂⇃</span>
            </span>
          </th>
          <th class="px-4 text-left font-normal">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="4" class="text-center text-[#9aa3b0] py-8 text-xs bg-white dark:bg-[#080c14]">
            No Cancelled Order(s) Found
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
</script>
