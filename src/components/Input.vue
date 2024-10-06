<script setup lang="ts">
import { random } from '~/composables/helpers';

interface Props {
    id?: string;
    modelValue?: string | number | null;
    label?: string;
    inputClass?: string;
    type?: string;
    step?: string;
    readonly?: boolean;
    rules?: ((v: any) => string | boolean)[];
    name?: string;
    debounce?: number;
}

const props = withDefaults(defineProps<Props>(), {
    id: 'v-input-' + random(),
    type: 'text',
    readonly: false,
    debounce: 0,
});

const validators = inject<(() => boolean)[]>('formValidators', []);
const emit = defineEmits(['update:modelValue']);
const errorMessage = ref<string | null>(null);
const value = ref(props.modelValue);
const input = ref<HTMLInputElement>();
let to: NodeJS.Timeout | undefined = undefined;

const classes = computed(() => ({
    [props.inputClass || '']: true,
    'border-b-2 bg-black bg-opacity-20 rounded-t p-2 pt-4 outline-none w-full h-full text-base': true,
    'read-only:border-gray-400 read-only:border-dashed read-only:border-b': true,
    'border-gray-700': !errorMessage.value,
    'border-red-500': !!errorMessage.value,
    'focus-within:border-blue-600': true,
    'transition-colors': true,
}));

watch(
    () => props.modelValue,
    () => (value.value = props.modelValue)
);

watch(
    () => value.value,
    () => {
        const doUpdate = () => {
            errorMessage.value = null;

            if (value.value !== props.modelValue) {
                emit('update:modelValue', value.value);
            }
        };

        if (props.debounce > 0) {
            clearTimeout(to);
            to = setTimeout(doUpdate, props.debounce);
        } else {
            doUpdate();
        }
    }
);

const focus = () => {
    input.value?.focus();
};

const validate = () => {
    const brokenRule = props.rules?.map((rule) => rule(value.value)).find((result) => result !== true);
    if (brokenRule !== false && !!brokenRule) {
        errorMessage.value = brokenRule;
    }

    return !brokenRule;
};

validators.push(validate);

defineExpose({
    focus,
    validate,
});
</script>

<template>
    <div :class="{ 'relative input-container w-full': true, 'has-value': value != null && value !== '' }">
        <label
            :for="id"
            v-if="label"
            class="label transition-all absolute top-[22%] left-[8px] opacity-50 pointer-events-none"
        >
            {{ label }}
        </label>
        <textarea
            v-if="type === 'textarea'"
            v-model="value"
            ref="input"
            :id="id"
            :readonly="readonly"
            :step="step"
            :type="type"
            :name="name"
            :class="classes"
        >
            {{ value }}
        </textarea>

        <input
            v-else
            v-model="value"
            ref="input"
            :id="id"
            :readonly="readonly"
            :step="step"
            :type="type"
            :name="name"
            :class="classes"
        />

        <div class="absolute h-full w-full flex items-center justify-end top-0 gap-2 pointer-events-none p-2">
            <slot name="suffix" />

            <Transition name="shake">
                <Badge v-if="errorMessage" class="bg-red-500">
                    {{ errorMessage }}
                </Badge>
            </Transition>
        </div>
    </div>
</template>

<style scoped lang="scss">
.input-container {
    &.has-value,
    &:focus-within {
        .label {
            font-size: 0.7em;
            top: 2px;
        }
    }
}

.label {
    font-size: 1em;
}
</style>
